import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TaskService {

    private storageKey = 'academic-os-task';
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public tasks$ = this.tasksSubject.asObservable();

    constructor() {
      this.loadFromStorage();
    }

    private loadFromStorage(): void {
      if (typeof localStorage === 'undefined') return;
      const data = localStorage.getItem(this.storageKey);
      const tasks = data ? JSON.parse(data) : [];
      this.tasksSubject.next(tasks);
    }

    public getTasks(): Task[] {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }

    public saveTasks(tasks: Task[]): void {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
      }
    }

    public addTask(task: Task): void {
      const tasks = this.getTasks();
      tasks.push(task);
      this.saveTasks(tasks);
      this.tasksSubject.next(tasks); // <-- notificar
    }

    public deleteTasks(id: string): void {
      const tasks = this.getTasks().filter(t => t.id !== id);
      this.saveTasks(tasks);
      this.tasksSubject.next(tasks);
    }

    public updateTasks(id: string, partial: Partial<Task>): void {
      const tasks = this.getTasks().map(t => t.id === id ? {...t, ...partial} :t );
      this.saveTasks(tasks);
      this.tasksSubject.next(tasks);
    }
}
