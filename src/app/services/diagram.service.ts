import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Diagram } from '../../models/diagram.model';

@Injectable({ providedIn: 'root' })
export class DiagramService {
  private readonly STORAGE_KEY = 'academic-os-diagrams';
  private diagrams: Diagram[] = [];
  public readonly diagrams$ = new BehaviorSubject<Diagram[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.diagrams = raw ? JSON.parse(raw) : [];
    this.diagrams$.next(this.diagrams);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.diagrams));
    this.diagrams$.next(this.diagrams);
  }

  getDiagrams(): Diagram[] {
    return this.diagrams;
  }

  addDiagram(d: Diagram): void {
    this.diagrams.push(d);
    this.save();
  }

  updateDiagram(id: string, changes: Partial<Diagram>): void {
    const idx = this.diagrams.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.diagrams[idx] = { ...this.diagrams[idx], ...changes };
      this.save();
    }
  }

  deleteDiagram(id: string): void {
    this.diagrams = this.diagrams.filter(d => d.id !== id);
    this.save();
  }
}
