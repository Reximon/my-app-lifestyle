import { DecimalPipe } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  imports: [DecimalPipe],
  templateUrl: './pomodoro.html',
  styleUrl: './pomodoro.scss',
})
export class Pomodoro {

  constructor(private cdr: ChangeDetectorRef) {}

  public minutes: number = 25;
  public seconds: number = 0;
  public isRunning: boolean = false;
  public isBreak: boolean = false;
  public intervalId: any;

  public start() {

    this.intervalId = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          //Se acabó el tiempo
          this.isBreak = !this.isBreak;
          this.minutes = this.isBreak ? 5 : 25;
          this.seconds = 0;
          this.isRunning = false;
          clearInterval(this.intervalId);
          if ('Notification' in window) {
            new Notification(this.isBreak ? 'Descanso terminado' : 'Tiempo de trabajo terminado');
          }
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
    clearInterval(this.intervalId);
    this.isRunning = false;
  }

  public reset() {

    clearInterval(this.intervalId);
    this.minutes = 25;
    this.seconds = 0;
    this.isRunning = false;
    this.isBreak = false;

  }

  /**
   * toggle
   */
  public toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.isRunning = true;
      this.start();
    }
  }

}
