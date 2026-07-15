import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Objective } from '../../models/objective.model';

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  private readonly STORAGE_KEY = 'academic-os-objectives';
  private objectives: Objective[] = [];
  public readonly objectives$ = new BehaviorSubject<Objective[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.objectives = raw ? JSON.parse(raw) : [];
    this.objectives$.next(this.objectives);
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.objectives));
    this.objectives$.next(this.objectives);
  }

  getObjectives(): Objective[] {
    return this.objectives;
  }

  addObjective(o: Objective): void {
    this.objectives.push(o);
    this.save();
  }

  updateObjective(id: string, changes: Partial<Objective>): void {
    const idx = this.objectives.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.objectives[idx] = { ...this.objectives[idx], ...changes };
      this.save();
    }
  }

  deleteObjective(id: string): void {
    this.objectives = this.objectives.filter(o => o.id !== id);
    this.save();
  }
}
