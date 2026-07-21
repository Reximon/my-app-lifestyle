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
    this.migrateSortOrder();
    this.sortDiagrams();
    this.diagrams$.next(this.diagrams);
  }

  private migrateSortOrder(): void {
    let changed = false;
    for (let i = 0; i < this.diagrams.length; i++) {
      if (this.diagrams[i].sortOrder === undefined) {
        this.diagrams[i].sortOrder = i;
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.diagrams));
    }
  }

  private sortDiagrams(): void {
    this.diagrams.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  moveUp(id: string): void {
    const idx = this.diagrams.findIndex(d => d.id === id);
    if (idx <= 0) return;
    const prev = this.diagrams[idx - 1];
    const curr = this.diagrams[idx];
    const tmp = prev.sortOrder;
    prev.sortOrder = curr.sortOrder;
    curr.sortOrder = tmp;
    this.sortDiagrams();
    this.save();
  }

  moveDown(id: string): void {
    const idx = this.diagrams.findIndex(d => d.id === id);
    if (idx === -1 || idx >= this.diagrams.length - 1) return;
    const next = this.diagrams[idx + 1];
    const curr = this.diagrams[idx];
    const tmp = next.sortOrder;
    next.sortOrder = curr.sortOrder;
    curr.sortOrder = tmp;
    this.sortDiagrams();
    this.save();
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.diagrams));
    this.diagrams$.next(this.diagrams);
  }

  getDiagrams(): Diagram[] {
    return this.diagrams;
  }

  addDiagram(d: Diagram): void {
    d.sortOrder = this.diagrams.length;
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
