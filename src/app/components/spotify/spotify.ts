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

  private storageKey = 'spotify-playlists';
  private defaultEntry: PlaylistEntry = {
    id: 'playlist/37i9dQZF1DX3Ogo9pFvBkY',
    label: 'Peaceful Piano',
  };

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
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
  }

  get activeEmbedUrl(): SafeResourceUrl | null {
    const entry = this.playlists[this.activeIndex];
    if (!entry) return null;
    const url = `https://open.spotify.com/embed/${entry.id}?utm_source=generator`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    this.inputUrl = '';
    this.inputLabel = '';
    this.cdr.markForCheck();
  }

  public select(i: number): void {
    this.activeIndex = i;
  }

  public remove(i: number): void {
    this.playlists.splice(i, 1);
    this.save();
    if (this.activeIndex >= this.playlists.length) {
      this.activeIndex = Math.max(0, this.playlists.length - 1);
    }
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.playlists));
  }

  private deriveLabel(id: string): string {
    const [type] = id.split('/');
    const map: Record<string, string> = {
      playlist: 'Playlist',
      track: 'Track',
      album: 'Álbum',
      episode: 'Episodio',
    };
    return map[type] || 'Spotify';
  }

  private extractId(url: string): string | null {
    const match = url.match(/spotify\.com\/(track|playlist|album|episode)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `${match[1]}/${match[2]}`;
  }
}
