import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpotifyService {

  public onStateChange = new Subject<void>();
  public user: any = null;
  public playlists: any[] = [];

  private accessToken: string | null = null;
  private expiresAt = 0;
  private storageKey = 'spotify-tokens';

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.accessToken = data.access_token;
        this.expiresAt = data.expires_at;
      } catch { /* ignore */ }
    }
    this.handleRedirectCallback();
  }

  get isConnected(): boolean {
    return !!this.accessToken && Date.now() < this.expiresAt;
  }

  get clientId(): string {
    return environment.spotifyClientId;
  }

  get hasClientId(): boolean {
    return !!environment.spotifyClientId;
  }

  login(): void {
    const verifier = this.generateVerifier();

    this.generateChallenge(verifier).then(challenge => {
      const params = new URLSearchParams({
        client_id: this.clientId,
        response_type: 'code',
        redirect_uri: environment.spotifyRedirectUri,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state: verifier,
        scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative',
      });
      window.location.href = `https://accounts.spotify.com/authorize?${params}`;
    });
  }

  logout(): void {
    this.accessToken = null;
    this.expiresAt = 0;
    this.user = null;
    this.playlists = [];
    localStorage.removeItem(this.storageKey);
    this.onStateChange.next();
  }

  async fetchProfile(): Promise<any> {
    const data = await this.apiGet('/me');
    this.user = data;
    this.onStateChange.next();
    return data;
  }

  async fetchPlaylists(): Promise<any[]> {
    const data = await this.apiGet('/me/playlists?limit=50');
    this.playlists = data.items || [];
    this.onStateChange.next();
    return this.playlists;
  }

  private async apiGet(endpoint: string): Promise<any> {
    if (!this.accessToken) throw new Error('Not connected');
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired');
    }
    return res.json();
  }

  private handleRedirectCallback(): void {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const verifier = params.get('state');

    if (!code || !verifier) return;

    window.history.replaceState({}, '', window.location.pathname);
    this.exchangeCode(code, verifier);
  }

  private async exchangeCode(code: string, verifier: string): Promise<void> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: environment.spotifyRedirectUri,
      client_id: this.clientId,
      code_verifier: verifier,
    });

    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await res.json();
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.expiresAt = Date.now() + data.expires_in * 1000;
        localStorage.setItem(this.storageKey, JSON.stringify({
          access_token: this.accessToken,
          expires_at: this.expiresAt,
        }));
      } else {
        console.error('Spotify exchange error:', data);
      }
    } catch (e) {
      console.error('Spotify token exchange failed:', e);
    }
    this.onStateChange.next();
  }

  private generateVerifier(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return Array.from(array, b => chars[b % chars.length]).join('');
  }

  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  private async generateChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
