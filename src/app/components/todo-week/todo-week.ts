import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-week',
  imports: [DatePipe, FormsModule, FaIconComponent],
  templateUrl: './todo-week.html',
  styleUrl: './todo-week.scss',
})
export class TodoWeek implements OnInit {

  public tasks: Task[] = [];
  public filterStatus: string = 'pendiente';
  public showModal = false;
  public editTask: Task | null = null;
  public modalTitle = '';
  public modalDescription = '';
  public modalDueDate = '';
  public modalStatus: Task['status'] = 'pendiente';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.filter(t => t.type === 'tarea');
    });
  }

  public get filteredTasks(): Task[] {
    if (this.filterStatus === 'completado') {
      return this.tasks.filter(t => t.status === 'completado');
    }
    if (this.filterStatus === 'pendiente') {
      return this.tasks.filter(t => t.status === 'pendiente');
    }
    return [...this.tasks].sort((a, b) => {
      if (a.status === 'pendiente' && b.status === 'completado') return -1;
      if (a.status === 'completado' && b.status === 'pendiente') return 1;
      return 0;
    });
  }

  public toggleTask(task: Task): void {
    const newStatus = task.status === 'completado' ? 'pendiente' : 'completado';
    this.taskService.updateTasks(task.id, { status: newStatus });
  }

  openEdit(t: Task): void {
    this.editTask = t;
    this.modalTitle = t.title;
    this.modalDescription = t.description || '';
    this.modalDueDate = t.dueDate || '';
    this.modalStatus = t.status;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveModal(): void {
    const title = this.modalTitle.trim();
    if (!title || !this.editTask) return;

    this.taskService.updateTasks(this.editTask.id, {
      title,
      description: this.modalDescription || undefined,
      dueDate: this.modalDueDate || undefined,
      status: this.modalStatus,
    });
    this.closeModal();
  }
}
