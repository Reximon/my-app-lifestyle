import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

interface PlaylistEntry {
  id: string;
  label: string;
}

@Component({
  selector: 'app-spotify',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './spotify.html',
  styleUrl: './spotify.scss',
})
export class Spotify {
  public playlists: PlaylistEntry[] = [];
  public activeIndex = 0;
  public inputUrl = '';
  public inputLabel = '';
  public showModal = false;

  private storageKey = 'spotify-playlists';
  private defaultEntry: PlaylistEntry = {
    id: 'playlist/7bswmJOu8DVJgN0cwVwPXW',
    label: 'Default',
  };
  private cachedEmbedUrl: SafeResourceUrl | null = null;
  private cachedIndex = -1;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.playlists = JSON.parse(saved);
        if (!this.playlists.length) this.playlists = [this.defaultEntry];
      } catch {
        this.playlists = [this.defaultEntry];
      }
    } else {
      this.playlists = [this.defaultEntry];
      this.save();
    }
    this.buildEmbedUrl();
  }

  get activeEmbedUrl(): SafeResourceUrl | null {
    return this.cachedEmbedUrl;
  }

  private buildEmbedUrl(): void {
    const entry = this.playlists[this.activeIndex];
    if (!entry) {
      this.cachedEmbedUrl = null;
    } else {
      const url = `https://open.spotify.com/embed/${entry.id}?utm_source=generator`;
      this.cachedEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    this.cachedIndex = this.activeIndex;
  }

  public openModal(): void {
    this.inputUrl = '';
    this.inputLabel = '';
    this.showModal = true;
  }

  public closeModal(): void {
    this.showModal = false;
  }

  public addPlaylist(): void {
    const url = this.inputUrl.trim();
    const id = this.extractId(url);
    if (!id) return;
    if (this.playlists.some(p => p.id === id)) return;
    const label = this.inputLabel.trim() || this.deriveLabel(id);
    this.playlists.push({ id, label });
    this.save();
    this.activeIndex = this.playlists.length - 1;
    this.buildEmbedUrl();
    this.showModal = false;
    this.cdr.markForCheck();
  }

  public select(i: number): void {
    if (i === this.activeIndex) return;
    this.activeIndex = i;
    this.buildEmbedUrl();
  }

  public remove(i: number): void {
    this.playlists.splice(i, 1);
    this.save();
    if (this.activeIndex >= this.playlists.length) {
      this.activeIndex = Math.max(0, this.playlists.length - 1);
    }
    this.buildEmbedUrl();
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.playlists));
  }

  private deriveLabel(id: string): string {
    const map: Record<string, string> = {
      playlist: 'Playlist',
      track: 'Track',
      album: 'Álbum',
      episode: 'Episodio',
    };
    return map[id.split('/')[0]] || 'Spotify';
  }

  private extractId(url: string): string | null {
    const match = url.match(/spotify\.com\/(track|playlist|album|episode)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `${match[1]}/${match[2]}`;
  }
}
