import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ObjectiveService } from '../../services/objective.service';
import { Objective } from '../../../models/objective.model';

@Component({
  selector: 'app-objectives',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './objectives.html',
  styleUrl: './objectives.scss',
})
export class Objectives {
  public objectives: Objective[] = [];
  public activeScope: Objective['scope'] = 'daily';
  public showModal = false;
  public modalScope: Objective['scope'] = 'daily';
  public modalTitle = '';
  public modalDescription = '';
  public modalDueDate = '';

  public scopes: { key: Objective['scope']; label: string; icon: IconProp }[] = [
    { key: 'daily', label: 'Diario', icon: ['fas', 'sun'] },
    { key: 'weekly', label: 'Semanal', icon: ['fas', 'calendar-week'] },
    { key: 'semester', label: 'Semestral', icon: ['fas', 'graduation-cap'] },
  ];

  constructor(
    private objectiveService: ObjectiveService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadObjectives();
    this.objectiveService.objectives$.subscribe(() => {
      this.loadObjectives();
      this.cdr.markForCheck();
    });
  }

  private loadObjectives(): void {
    this.objectives = this.objectiveService.getObjectives();
  }

  get filtered(): Objective[] {
    return this.objectives.filter(o => o.scope === this.activeScope);
  }

  setScope(s: Objective['scope']): void {
    this.activeScope = s;
  }

  countByScope(s: Objective['scope']): number {
    return this.objectives.filter(o => o.scope === s).length;
  }

  openAdd(scope: Objective['scope']): void {
    this.modalScope = scope;
    this.modalTitle = '';
    this.modalDescription = '';
    this.modalDueDate = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveModal(): void {
    const title = this.modalTitle.trim();
    if (!title) return;
    const obj: Objective = {
      id: Date.now().toString(),
      scope: this.modalScope,
      title,
      description: this.modalDescription || undefined,
      dueDate: this.modalDueDate || undefined,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    this.objectiveService.addObjective(obj);
    this.activeScope = this.modalScope;
    this.closeModal();
  }

  toggleStatus(o: Objective): void {
    const newStatus = o.status === 'completado' ? 'pendiente' : 'completado';
    this.objectiveService.updateObjective(o.id, { status: newStatus });
  }

  deleteObjective(id: string): void {
    this.objectiveService.deleteObjective(id);
  }
}
