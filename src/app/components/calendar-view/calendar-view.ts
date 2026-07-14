import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
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

  constructor(private taskService: TaskService) {}

  // Esto incializa el calendario
  ngOnInit(): void {
    this.generateCalendar();
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
  }
  public closeModal(): void {
    this.selectedTask = null;
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
}
