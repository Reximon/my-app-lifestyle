import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DiagramService } from '../../services/diagram.service';
import { TaskService } from '../../services/task.service';
import { Diagram } from '../../../models/diagram.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-diagram-gallery',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './diagram-gallery.html',
  styleUrl: './diagram-gallery.scss',
})
export class DiagramGallery {
  public diagrams: Diagram[] = [];
  public topics: Task[] = [];
  public lightbox: Diagram | null = null;
  public showTitleInput = false;
  public pendingFile: File | null = null;
  public pendingTitle = '';
  public pendingTopicId = '';
  public topicFilter = 'todas';

  constructor(
    private diagramService: DiagramService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    this.load();
    this.diagramService.diagrams$.subscribe(() => {
      this.load();
      this.cdr.markForCheck();
    });
    this.taskService.tasks$.subscribe(() => {
      this.topics = this.taskService.getTasks().filter(t => t.type === 'topic');
      this.cdr.markForCheck();
    });
  }

  private load(): void {
    this.diagrams = this.diagramService.getDiagrams();
    this.topics = this.taskService.getTasks().filter(t => t.type === 'topic');
  }

  get filtered(): Diagram[] {
    return this.topicFilter === 'todas'
      ? this.diagrams
      : this.diagrams.filter(d => d.topicId === this.topicFilter);
  }

  topicName(id?: string): string {
    if (!id) return '';
    return this.topics.find(t => t.id === id)?.title || '—';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.pendingFile = file;
    this.pendingTitle = file.name.replace(/\.[^/.]+$/, '');
    this.pendingTopicId = '';
    this.showTitleInput = true;
    input.value = '';
  }

  confirmUpload(): void {
    if (!this.pendingFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      this.resizeImage(dataUrl, 800, (resized) => {
        const diagram: Diagram = {
          id: Date.now().toString(),
          title: this.pendingTitle.trim() || 'Sin título',
          dataUrl: resized,
          topicId: this.pendingTopicId || undefined,
          createdAt: new Date().toISOString(),
        };
        this.diagramService.addDiagram(diagram);
        this.cancelUpload();
      });
    };
    reader.readAsDataURL(this.pendingFile);
  }

  cancelUpload(): void {
    this.showTitleInput = false;
    this.pendingFile = null;
    this.pendingTitle = '';
    this.pendingTopicId = '';
  }

  private resizeImage(dataUrl: string, maxSize: number, cb: (resized: string) => void): void {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      cb(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = dataUrl;
  }

  openLightbox(d: Diagram): void {
    this.lightbox = d;
  }

  closeLightbox(): void {
    this.lightbox = null;
  }

  deleteDiagram(id: string): void {
    this.diagramService.deleteDiagram(id);
    if (this.lightbox?.id === id) this.lightbox = null;
  }
}
