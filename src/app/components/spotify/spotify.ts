import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-spotify',
  imports: [FaIconComponent],
  templateUrl: './spotify.html',
  styleUrl: './spotify.scss',
})
export class Spotify {
  public loading = false;
  public error: string | null = null;
  public activePlaylist: any = null;

  constructor(
    protected spotify: SpotifyService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    if (this.spotify.isConnected) {
      this.loadData();
    }
    this.spotify.onStateChange.subscribe(() => {
      this.cdr.markForCheck();
      if (this.spotify.isConnected && !this.spotify.user) {
        this.loadData();
      }
    });
  }

  get activeEmbedUrl(): SafeResourceUrl | null {
    if (!this.activePlaylist) return null;
    const id = this.activePlaylist.id;
    const url = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get origin(): string {
    return window.location.origin;
  }

  connect(): void {
    this.spotify.login();
  }

  disconnect(): void {
    this.activePlaylist = null;
    this.spotify.logout();
  }

  selectPlaylist(p: any): void {
    this.activePlaylist = p;
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      await this.spotify.fetchProfile();
      await this.spotify.fetchPlaylists();
    } catch (e: any) {
      this.error = e?.message || 'Error al cargar datos de Spotify';
    }
    this.loading = false;
    this.cdr.markForCheck();
  }
}
