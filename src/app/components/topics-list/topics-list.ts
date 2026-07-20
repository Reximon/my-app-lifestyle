import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { DiagramService } from '../../services/diagram.service';
import { Task } from '../../models/task.model';
import { Diagram } from '../../../models/diagram.model';

const TOPIC_COLORS = [
  '#f59e0b', '#22c55e', '#3b82f6', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#06b6d4', '#d946ef',
];

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './topics-list.html',
  styleUrl: './topics-list.scss',
})
export class TopicsList {
  public topics: Task[] = [];
  public diagrams: Diagram[] = [];
  public showModal = false;
  public editTopic: Task | null = null;
  public modalTitle = '';
  public modalDescription = '';
  public modalDueDate = '';
  public modalStatus: Task['status'] = 'pendiente';
  public modalColor = '';

  constructor(
    private taskService: TaskService,
    private diagramService: DiagramService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadTopics();
    this.taskService.tasks$.subscribe(() => {
      this.loadTopics();
      this.cdr.markForCheck();
    });
    this.diagramService.diagrams$.subscribe(() => {
      this.diagrams = this.diagramService.getDiagrams();
      this.cdr.markForCheck();
    });
  }

  private loadTopics(): void {
    this.topics = this.taskService.getTasks().filter(t => t.type === 'topic');
    this.diagrams = this.diagramService.getDiagrams();
  }

  get colors(): string[] {
    return TOPIC_COLORS;
  }

  diagramsForTopic(topicId: string): Diagram[] {
    return this.diagrams.filter(d => d.topicId === topicId);
  }

  diagramCount(topicId: string): number {
    return this.diagrams.filter(d => d.topicId === topicId).length;
  }

  unlinkDiagram(diagramId: string): void {
    this.diagramService.updateDiagram(diagramId, { topicId: undefined });
  }

  public openAdd(): void {
    this.editTopic = null;
    this.modalTitle = '';
    this.modalDescription = '';
    this.modalDueDate = '';
    this.modalStatus = 'pendiente';
    this.modalColor = '';
    this.showModal = true;
  }

  public openEdit(t: Task): void {
    this.editTopic = t;
    this.modalTitle = t.title;
    this.modalDescription = t.description || '';
    this.modalDueDate = t.dueDate || '';
    this.modalStatus = t.status;
    this.modalColor = t.color || '';
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
        color: this.modalColor || undefined,
      });
    } else {
      const task: Task = {
        id: Date.now().toString(),
        type: 'topic',
        title,
        description: this.modalDescription || undefined,
        dueDate: this.modalDueDate || undefined,
        status: this.modalStatus,
        color: this.modalColor || undefined,
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
