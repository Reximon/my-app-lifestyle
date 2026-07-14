import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendar {

  public isSignedIn = false;
  public userEmail = '';
  public events: any[] = [];
  public onStateChange = new Subject<void>();

  private accessToken: string | null = null;
  private tokenClient: any = null;

  constructor() {
    const checkGoogle = () => {
      if (typeof google !== 'undefined' && google.accounts?.oauth2) {
        this.initTokenClient();
      } else {
        setTimeout(checkGoogle, 500);
      }
    };
    checkGoogle();
  }

  private initTokenClient(): void {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
      callback: (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          this.isSignedIn = true;
          this.fetchUserInfo();
        }
      },
    });
  }

  private fetchUserInfo(): void {
    fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        this.userEmail = (data.email || '').toLowerCase();
        this.onStateChange.next();
      })
      .catch(() => this.onStateChange.next());
  }

  public signIn(): void {
    if (!this.tokenClient) return;
    this.accessToken = null;
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  public signOut(): void {
    this.accessToken = null;
    this.isSignedIn = false;
    this.events = [];
    this.onStateChange.next();
  }

  public createEvent(eventData: any): void {
    if (!this.accessToken) return;
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then(() => this.listEvents())
      .catch((err) => console.error('Error creando evento:', err));
  }

  public updateEvent(eventId: string, eventData: any): void {
    if (!this.accessToken) return;
    fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then(() => this.listEvents())
      .catch((err) => console.error('Error actualizando evento:', err));
  }

  public deleteEvent(eventId: string): void {
    if (!this.accessToken) return;
    fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })
      .then(() => this.listEvents())
      .catch((err) => console.error('Error borrando evento:', err));
  }

  public listEvents(): void {
    if (!this.accessToken) return;

    const timeMin = new Date();
    timeMin.setMonth(timeMin.getMonth() - 1);
    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 2);

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&maxResults=50`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('Eventos recibidos:', data);
        this.events = data.items || [];
        this.onStateChange.next();
      })
      .catch((err) => console.error('Error al obtener eventos:', err));
  }

}
