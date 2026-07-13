import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-week',
  imports: [],
  templateUrl: './todo-week.html',
  styleUrl: './todo-week.scss',
})
export class TodoWeek implements OnInit {

  public tasks: Task[] = [];
  public filterStatus: string = 'todas';

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
    return this.tasks.filter(t => t.status === 'pendiente');
  }

  public toggleTask(task: Task): void {
    const newStatus = task.status === 'completado' ? 'pendiente' : 'completado';
    this.taskService.updateTasks(task.id, { status: newStatus });
  }

}
