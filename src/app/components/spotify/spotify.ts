import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-spotify',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './spotify.html',
  styleUrl: './spotify.scss',
})
export class Spotify {
  public inputUrl = '';
  public embedUrl: SafeResourceUrl | null = null;
  public saved = false;

  private storageKey = 'spotify-embed-url';
  private defaultUrl = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator';

  constructor(private sanitizer: DomSanitizer) {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(saved);
      this.saved = true;
    } else {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl);
    }
  }

  public loadUrl(): void {
    const id = this.extractId(this.inputUrl.trim());
    if (!id) return;
    const embed = `https://open.spotify.com/embed/${id}?utm_source=generator`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    localStorage.setItem(this.storageKey, embed);
    this.saved = true;
    this.inputUrl = '';
  }

  public resetUrl(): void {
    localStorage.removeItem(this.storageKey);
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl);
    this.saved = false;
  }

  private extractId(url: string): string | null {
    const match = url.match(/spotify\.com\/(track|playlist|album|episode)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `${match[1]}/${match[2]}`;
  }
}
