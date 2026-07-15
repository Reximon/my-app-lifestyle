import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './topics-list.html',
  styleUrl: './topics-list.scss',
})
export class TopicsList {
  public topics: Task[] = [];
  public newTitle = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadTopics();
    this.taskService.tasks$.subscribe(() => {
      this.loadTopics();
      this.cdr.markForCheck();
    });
  }

  private loadTopics(): void {
    this.topics = this.taskService.getTasks().filter(t => t.type === 'topic');
  }

  public addTopic(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    const task: Task = {
      id: Date.now().toString(),
      type: 'topic',
      title,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    this.taskService.addTask(task);
    this.newTitle = '';
  }

  public toggleStatus(topic: Task): void {
    const newStatus = topic.status === 'completado' ? 'pendiente' : 'completado';
    this.taskService.updateTasks(topic.id, { status: newStatus });
  }

  public deleteTopic(id: string): void {
    this.taskService.deleteTasks(id);
  }
}
