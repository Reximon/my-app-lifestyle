import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-pomodoro',
  imports: [FaIconComponent],
  templateUrl: './pomodoro.html',
  styleUrl: './pomodoro.scss',
})
export class Pomodoro implements OnDestroy {
  public minutes: number = 25;
  public seconds: number = 0;
  public isRunning: boolean = false;
  public isBreak: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  public start() {
    this.intervalId = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.isBreak = !this.isBreak;
          this.minutes = this.isBreak ? 5 : 25;
          this.seconds = 0;
          this.isRunning = false;
          if (this.intervalId) clearInterval(this.intervalId);
          if ('Notification' in window) {
            new Notification(this.isBreak ? 'Descanso terminado' : 'Tiempo de trabajo terminado');
          }
          this.cdr.detectChanges();
          return;
        }
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  public pause() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isRunning = false;
  }

  public reset() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.minutes = 25;
    this.seconds = 0;
    this.isRunning = false;
    this.isBreak = false;
  }

  public toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.isRunning = true;
      this.start();
    }
  }
}
