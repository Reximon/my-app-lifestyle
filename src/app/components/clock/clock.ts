import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
})
export class Clock implements OnInit, OnDestroy {
      constructor(private cdr: ChangeDetectorRef) {}

      public date: string = '';
      public digitalTime: string = '';
      public hoursDeg = 0;
      public minutesDeg = 0;
      public secondsDeg = 0;
      public hourMarks = Array.from({ length: 12 }, (_, i) => i);
      private intervalId: any;

      ngOnInit(): void {
        this.updateClock();
        this.intervalId = setInterval(() => this.updateClock(), 1000);
      }

      private updateClock(): void {
        const now = new Date();
        this.digitalTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        this.date = now.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        this.hoursDeg = h * 30 + m * 0.5;
        this.minutesDeg = m * 6 + s * 0.1;
        this.secondsDeg = s * 6;
        this.cdr.detectChanges();
      }

      ngOnDestroy(): void {
        clearInterval(this.intervalId);
      }
}
