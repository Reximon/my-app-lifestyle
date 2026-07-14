import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus, faPlay, faPause, faRotate, faChevronLeft, faChevronRight, faTrash, faSave, faTimes, faFilter, faCalendar, faClock, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Clock } from "./components/clock/clock";
import { ActionsPanel } from './components/actions-panel/actions-panel';
import { TodoWeek } from './components/todo-week/todo-week';
import { Pomodoro } from './components/pomodoro/pomodoro';
import { CalendarView } from './components/calendar-view/calendar-view';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FaIconComponent, Clock, ActionsPanel, TodoWeek, Pomodoro, CalendarView],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-academic-os');

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheck, faPlus, faPlay, faPause, faRotate, faChevronLeft, faChevronRight, faTrash, faSave, faTimes, faFilter, faCalendar, faClock, faUpload);
  }
}
