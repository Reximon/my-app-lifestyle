import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClassNote } from '../../models/class-note.model';

@Injectable({ providedIn: 'root' })
export class ClassNoteService {
  private readonly STORAGE_KEY = 'academic-os-class-notes';
  private classNotes: ClassNote[] = [];
  public readonly classNotes$ = new BehaviorSubject<ClassNote[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.classNotes = raw ? JSON.parse(raw) : [];
    this.classNotes$.next(this.classNotes);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.classNotes));
    this.classNotes$.next(this.classNotes);
  }

  getNotes(): ClassNote[] {
    return this.classNotes;
  }

  addNote(c: ClassNote): void {
    this.classNotes.push(c);
    this.save();
  }

  updateNote(id: string, changes: Partial<ClassNote>): void {
    const idx = this.classNotes.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.classNotes[idx] = { ...this.classNotes[idx], ...changes };
      this.save();
    }
  }

  deleteNote(id: string): void {
    this.classNotes = this.classNotes.filter(n => n.id !== id);
    this.save();
  }
}
