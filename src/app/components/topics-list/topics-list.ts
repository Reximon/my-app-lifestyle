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
  public showModal = false;
  public editTopic: Task | null = null;
  public modalTitle = '';
  public modalDescription = '';
  public modalDueDate = '';
  public modalStatus: Task['status'] = 'pendiente';

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

  public openAdd(): void {
    this.editTopic = null;
    this.modalTitle = '';
    this.modalDescription = '';
    this.modalDueDate = '';
    this.modalStatus = 'pendiente';
    this.showModal = true;
  }

  public openEdit(t: Task): void {
    this.editTopic = t;
    this.modalTitle = t.title;
    this.modalDescription = t.description || '';
    this.modalDueDate = t.dueDate || '';
    this.modalStatus = t.status;
    this.showModal = true;
  }

  public closeModal(): void {
    this.showModal = false;
  }

  public saveModal(): void {
    const title = this.modalTitle.trim();
    if (!title) return;

    if (this.editTopic) {
      this.taskService.updateTasks(this.editTopic.id, {
        title,
        description: this.modalDescription || undefined,
        dueDate: this.modalDueDate || undefined,
        status: this.modalStatus,
      });
    } else {
      const task: Task = {
        id: Date.now().toString(),
        type: 'topic',
        title,
        description: this.modalDescription || undefined,
        dueDate: this.modalDueDate || undefined,
        status: this.modalStatus,
        createdAt: new Date().toISOString(),
      };
      this.taskService.addTask(task);
    }
    this.closeModal();
  }

  public toggleStatus(topic: Task): void {
    const newStatus = topic.status === 'completado' ? 'pendiente' : 'completado';
    this.taskService.updateTasks(topic.id, { status: newStatus });
  }

  public deleteTopic(id: string): void {
    this.taskService.deleteTasks(id);
  }
}
