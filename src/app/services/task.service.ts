import { Injectable } from '@angular/core';
import { Task } from '../models/task.model'

@Injectable({
  providedIn: 'root',
})

export class TaskService {
    private storageKey = 'academic-os-task'

    public getTasks(): Task[] {
      const data = localStorage.getItem(this.storageKey);

      return data ? JSON.parse(data) : [];
    }

    public saveTasks(tasks: Task[]): void{
      localStorage.setItem(this.storageKey, JSON.stringify(tasks))
    }

    public addTask(task: Task): void {
      const tasks = this.getTasks();
      tasks.push(task);
      this.saveTasks(tasks);
    }

    public deleteTasks(id: string): void {
      const tasks = this.getTasks().filter(t => t.id !== id);
      this.saveTasks(tasks);
    }

    public updateTasks(id: string, partial: Partial<Task>): void {
      const tasks = this.getTasks().map(t => t.id === id ? {...t, ...partial} :t );
      this.saveTasks(tasks);
    }
}
