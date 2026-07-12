import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
})
export class Clock implements OnInit, OnDestroy {
      public date: string = '';
      public time: string = '';
      public intervalId: any;


      ngOnInit(): void {
        const ahora = new Date();
        this.time = ahora.toLocaleTimeString('es-ES');
        this.date = ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      this.intervalId = setInterval(() => {
        const now = new Date();
        this.time = now.toLocaleTimeString('es-ES');
        this.date = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      }, 1000);
    }
      ngOnDestroy(): void {
        clearInterval(this.intervalId)
      }

}
