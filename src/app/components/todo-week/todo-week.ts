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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks().filter(t => t.type === 'tarea');
  }

  public toggleTask(task: Task): void {
  const newStatus = task.status === 'completado' ? 'pendiente' : 'completado';
  this.taskService.updateTasks(task.id, { status: newStatus });
  this.tasks = this.taskService.getTasks().filter(t => t.type === 'tarea');
}

}
