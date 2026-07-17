import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Assignment } from '../../models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly STORAGE_KEY = 'academic-os-assignments';
  private assignments: Assignment[] = [];
  public readonly assignments$ = new BehaviorSubject<Assignment[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.assignments = raw ? JSON.parse(raw) : [];
    this.assignments$.next(this.assignments);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.assignments));
    this.assignments$.next(this.assignments);
  }

  getAssignments(): Assignment[] {
    return this.assignments;
  }

  addAssignment(a: Assignment): void {
    this.assignments.push(a);
    this.save();
  }

  updateAssignment(id: string, changes: Partial<Assignment>): void {
    const idx = this.assignments.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.assignments[idx] = { ...this.assignments[idx], ...changes };
      this.save();
    }
  }

  deleteAssignment(id: string): void {
    this.assignments = this.assignments.filter(a => a.id !== id);
    this.save();
  }
}
