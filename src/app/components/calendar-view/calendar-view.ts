import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { GoogleCalendar } from '../../services/google-calendar';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-calendar-view',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
})
export class CalendarView implements OnInit, AfterViewInit {

  public currentMonth: Date = new Date();
  public calendarDays: (number | null)[] = [];
  public firstDayIndex: number | any;
  public selectedTask: Task | null = null
  public selectedGoogleEvent: any = null
  public googleEvents: any[] = [];
  public isGoogleSignedIn = false;
  public eventsByDay: Map<number, any[]> = new Map();
  public tasksByDay: Map<number, Task[]> = new Map();
  public filterType: string = 'todas';

  constructor(
    private taskService: TaskService,
    public googleCalendar: GoogleCalendar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.buildMaps();
    this.googleCalendar.onStateChange.subscribe(() => {
      this.googleEvents = this.googleCalendar.events;
      this.isGoogleSignedIn = this.googleCalendar.isSignedIn;
      this.buildMaps();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  private buildMaps(): void {
    const prefix = `${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    this.tasksByDay.clear();
    this.eventsByDay.clear();
    const allTasks = this.taskService.getTasks();
    for (const t of allTasks) {
      if (this.filterType !== 'todas' && t.type !== this.filterType) continue;
      if (!t.dueDate?.startsWith(prefix)) continue;
      const day = parseInt(t.dueDate.slice(-2), 10);
      if (!this.tasksByDay.has(day)) this.tasksByDay.set(day, []);
      this.tasksByDay.get(day)!.push(t);
    }
    for (const e of this.googleEvents) {
      let dateStr: string | null = null;
      if (e.start?.dateTime) dateStr = e.start.dateTime.substring(0, 10);
      else if (e.start?.date) dateStr = e.start.date;
      if (!dateStr?.startsWith(prefix)) continue;
      const day = parseInt(dateStr.slice(-2), 10);
      if (!this.eventsByDay.has(day)) this.eventsByDay.set(day, []);
      this.eventsByDay.get(day)!.push(e);
    }
  }
  private generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date( year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) this.calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) this.calendarDays.push(i)


  }

  public loadGoogleEvents(): void {
    this.googleCalendar.listEvents();
  }

  public setFilterType(type: string): void {
    this.filterType = type;
    this.buildMaps();
  }

  public isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate()
      && this.currentMonth.getMonth() === today.getMonth()
      && this.currentMonth.getFullYear() === today.getFullYear();
  }

  public prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
    this.buildMaps();
  }

  public nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
    this.generateCalendar();
    this.buildMaps();
  }

  // Modal para clicar en la tarea
  public openTask(task: Task): void {
    this.selectedTask = task;
    this.selectedGoogleEvent = null;
  }
  public openGoogleEvent(event: any): void {
    this.selectedGoogleEvent = { ...event };
    this.selectedTask = null;
  }
  public closeModal(): void {
    this.selectedTask = null;
    this.selectedGoogleEvent = null;
  }

  private buildGoogleEventBody(task: Task): any {
    if (!task.dueDate) return null;
    const start = `${task.dueDate}T09:00:00`;
    const end = `${task.dueDate}T10:00:00`;
    return {
      summary: task.title,
      description: task.description || '',
      start: { dateTime: start, timeZone: 'Europe/Madrid' },
      end: { dateTime: end, timeZone: 'Europe/Madrid' },
    };
  }

  public deleteTask(id: string): void {
    const task = this.taskService.getTasks().find(t => t.id === id);
    if (task?.googleEventId && this.isGoogleSignedIn) {
      this.googleCalendar.deleteEvent(task.googleEventId);
    }
    this.taskService.deleteTasks(id);
    this.closeModal();
  }

  public saveTask(): void {
    if (!this.selectedTask) return;
    const task = this.selectedTask;
    this.taskService.updateTasks(task.id, task);

    console.log('saveTask', { signedIn: this.isGoogleSignedIn, dueDate: task.dueDate, googleEventId: task.googleEventId });

    if (!this.isGoogleSignedIn) { this.closeModal(); return; }

    const body = this.buildGoogleEventBody(task);
    console.log('Google body:', body);

    if (task.googleEventId && !body) {
      this.googleCalendar.deleteEvent(task.googleEventId);
      this.taskService.updateTasks(task.id, { googleEventId: undefined });
    } else if (task.googleEventId && body) {
      this.googleCalendar.updateEvent(task.googleEventId, body);
    } else if (!task.googleEventId && body) {
      this.googleCalendar.createEvent(body).then((event: any) => {
        console.log('Evento creado:', event);
        if (event?.id) {
          this.taskService.updateTasks(task.id, { googleEventId: event.id });
        }
      });
    }
    this.closeModal();
  }

  public saveGoogleEvent(): void {
    if (!this.selectedGoogleEvent) return;
    const e = this.selectedGoogleEvent;
    const body: any = { summary: e.summary, description: e.description || '' };
    if (e.start?.dateTime) {
      body.start = { dateTime: e.start.dateTime, timeZone: 'Europe/Madrid' };
      body.end = { dateTime: e.end?.dateTime || e.start.dateTime, timeZone: 'Europe/Madrid' };
    } else {
      body.start = { date: e.start?.date || e.start };
      body.end = { date: e.end?.date || e.start?.date || e.start };
    }
    this.googleCalendar.updateEvent(e.id, body);
    this.closeModal();
  }
  public deleteGoogleEvent(): void {
    if (this.selectedGoogleEvent) {
      this.googleCalendar.deleteEvent(this.selectedGoogleEvent.id);
      this.closeModal();
    }
  }
}
