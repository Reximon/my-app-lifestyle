import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendar {

  private gaspiLoaded = false;
  public isSignedIn = false;
  public events: any[] = [];
  private authInstance: any;

    private initClient(): void {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: environment.googleClientId,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(() => {
          this.authInstance = gapi.auth2.getAuthInstance();
          this.isSignedIn = this.authInstance.isSignedIn.get();
          this.authInstance.isSignedIn.listen((status: boolean) => {
            this.isSignedIn = status;
          });
        });
      });
    }

    constructor() {
      this.initClient();
    }

    public signIn(): void {
      this.authInstance.signIn();
    }

    public signOut(): void {
      this.authInstance.signOut();
      this.events = [];
    }

    public listEvents(): void {
      gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 50
      }).then((response: any) => {
        this.events = response.result.items;
      });
    }

}
