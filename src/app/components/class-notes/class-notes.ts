import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ClassNoteService } from '../../services/class-note.service';
import { ClassNote } from '../../../models/class-note.model';

@Component({
  selector: 'app-class-notes',
  imports: [FormsModule, DatePipe, FaIconComponent],
  templateUrl: './class-notes.html',
  styleUrl: './class-notes.scss',
})
export class ClassNotes {
  public notes: ClassNote[] = [];
  public courseFilter = 'todas';
  public expandedId: string | null = null;
  public showModal = false;
  public editNote: ClassNote | null = null;
  public modalCourse = '';
  public modalTitle = '';
  public modalContent = '';

  constructor(
    private classNoteService: ClassNoteService,
    private cdr: ChangeDetectorRef,
  ) {
    this.load();
    this.classNoteService.classNotes$.subscribe(() => {
      this.load();
      this.cdr.markForCheck();
    });
  }

  private load(): void {
    this.notes = this.classNoteService.getNotes();
  }

  get courses(): string[] {
    const set = new Set(this.notes.map(n => n.course).filter(Boolean));
    return ['todas', ...Array.from(set)];
  }

  get filtered(): ClassNote[] {
    return this.courseFilter === 'todas'
      ? this.notes
      : this.notes.filter(n => n.course === this.courseFilter);
  }

  toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  openAdd(): void {
    this.editNote = null;
    this.modalCourse = '';
    this.modalTitle = '';
    this.modalContent = '';
    this.showModal = true;
  }

  openEdit(n: ClassNote): void {
    this.editNote = n;
    this.modalCourse = n.course;
    this.modalTitle = n.title;
    this.modalContent = n.content || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveModal(): void {
    const title = this.modalTitle.trim();
    if (!title) return;

    if (this.editNote) {
      this.classNoteService.updateNote(this.editNote.id, {
        course: this.modalCourse,
        title,
        content: this.modalContent,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const n: ClassNote = {
        id: Date.now().toString(),
        course: this.modalCourse,
        title,
        content: this.modalContent,
        createdAt: new Date().toISOString(),
      };
      this.classNoteService.addNote(n);
    }
    this.closeModal();
  }

  deleteNote(id: string): void {
    this.classNoteService.deleteNote(id);
  }
}
