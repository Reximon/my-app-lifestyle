import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { GoogleCalendar } from '../../services/google-calendar';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-calendar-view',
  imports: [FormsModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
})
export class CalendarView implements OnInit{

  public currentMonth: Date = new Date();
  public calendarDays: (number | null)[] = [];
  public firstDayIndex: number | any;
  public selectedTask: Task | null = null
  public selectedGoogleEvent: any = null
  public googleEvents: any[] = [];
  public isGoogleSignedIn = false;

  constructor(
    private taskService: TaskService,
    public googleCalendar: GoogleCalendar,
    private cdr: ChangeDetectorRef
  ) {}

  // Esto incializa el calendario
  ngOnInit(): void {
    this.generateCalendar();
    // Escuchar cambios del servicio Google Calendar
    this.googleCalendar.onStateChange.subscribe(() => {
      this.googleEvents = this.googleCalendar.events;
      this.isGoogleSignedIn = this.googleCalendar.isSignedIn;
      this.cdr.detectChanges();
    });
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

  public getGoogleEventsForDay(day: number): any[] {
    const dateStr = `${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const filtered = this.googleEvents.filter((e: any) =>
      e.start?.dateTime?.startsWith(dateStr) || e.start?.date === dateStr
    );
    if (filtered.length > 0) console.log('Eventos para', dateStr, filtered);
    return filtered;
  }

  public prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  public nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
    this.generateCalendar();
  }

  public getTasksForDay(day: number) {
    const dateStr = `${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.taskService.getTasks().filter(t => t.dueDate?.startsWith(dateStr));
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

  public deleteTask(id: string): void {
    this.taskService.deleteTasks(id);
    this.closeModal();
  }
  public saveTask(): void {
    if (this.selectedTask) {
      this.taskService.updateTasks(this.selectedTask.id, this.selectedTask);
      this.closeModal();
    }
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
