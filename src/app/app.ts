import { Component, signal, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus, faPlay, faPause, faRotate, faChevronLeft, faChevronRight, faTrash, faSave, faTimes, faFilter, faCalendar, faClock, faUpload, faListCheck, faMosquito, faBook, faChalkboard, faClipboardList, faFileLines, faCheckDouble, faUser, faHeadphones, faMusic, faArrowRightToBracket, faRightFromBracket, faBullseye, faSun, faCalendarWeek, faGraduationCap, faPen, faBookOpen, faImage, faMagnifyingGlass, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Clock } from "./components/clock/clock";
import { ActionsPanel } from './components/actions-panel/actions-panel';
import { TodoWeek } from './components/todo-week/todo-week';
import { Pomodoro } from './components/pomodoro/pomodoro';
import { CalendarView } from './components/calendar-view/calendar-view';
import { Spotify } from './components/spotify/spotify';
import { TopicsList } from './components/topics-list/topics-list';
import { Objectives } from './components/objectives/objectives';
import { Assignments } from './components/assignments/assignments';
import { ClassNotes } from './components/class-notes/class-notes';
import { DiagramGallery } from './components/diagram-gallery/diagram-gallery';
import { GlobalSearch } from './components/global-search/global-search';
import { TaskService } from './services/task.service';
import { ObjectiveService } from './services/objective.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FaIconComponent, Clock, ActionsPanel, TodoWeek, Pomodoro, CalendarView, Spotify, TopicsList, Objectives, Assignments, ClassNotes, DiagramGallery, GlobalSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('my-academic-os');
  protected greeting = signal('');
  protected dateStr = signal('');
  protected pendingCount = signal(0);
  protected objDone = signal(0);
  protected objTotal = signal(0);

  private destroy$ = new Subject<void>();
  private taskService = inject(TaskService);
  private objectiveService = inject(ObjectiveService);

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheck, faPlus, faPlay, faPause, faRotate, faChevronLeft, faChevronRight, faTrash, faSave, faTimes, faFilter, faCalendar, faClock, faUpload, faListCheck, faMosquito, faBook, faChalkboard, faClipboardList, faFileLines, faCheckDouble, faUser, faHeadphones, faMusic, faArrowRightToBracket, faRightFromBracket, faBullseye, faSun, faCalendarWeek, faGraduationCap, faPen, faBookOpen, faImage, faMagnifyingGlass, faArrowUp, faArrowDown, faSpotify);
  }

  ngOnInit() {
    this.greeting.set(this.computeGreeting());
    this.updateDate();

    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.pendingCount.set(tasks.filter(t => t.status === 'pendiente').length);
    });

    this.objectiveService.objectives$.pipe(takeUntil(this.destroy$)).subscribe(objectives => {
      const daily = objectives.filter(o => o.scope === 'daily');
      this.objTotal.set(daily.length);
      this.objDone.set(daily.filter(o => o.status === 'completado').length);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private computeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  private updateDate(): void {
    const now = new Date();
    const day = now.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = now.toLocaleDateString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    this.dateStr.set(`${day} ${month} ${year}`);
  }
}
