import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { ObjectiveService } from '../../services/objective.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClassNoteService } from '../../services/class-note.service';
import { DiagramService } from '../../services/diagram.service';

interface SearchResult {
  id: string;
  type: string;
  label: string;
  title: string;
  description: string;
  icon: [string, string];
}

@Component({
  selector: 'app-global-search',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './global-search.html',
  styleUrl: './global-search.scss',
})
export class GlobalSearch {
  public query = '';
  public results: SearchResult[] = [];
  public showResults = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private allItems: SearchResult[] = [];

  constructor(
    private taskService: TaskService,
    private objectiveService: ObjectiveService,
    private assignmentService: AssignmentService,
    private classNoteService: ClassNoteService,
    private diagramService: DiagramService,
    private cdr: ChangeDetectorRef,
  ) {
    this.buildIndex();
  }

  private buildIndex(): void {
    const items: SearchResult[] = [
      ...this.taskService.getTasks().map(t => ({
        id: t.id,
        type: t.type === 'topic' ? 'topic' : 'tarea',
        label: t.type === 'topic' ? 'Topic' : 'Tarea',
        title: t.title,
        description: t.description || '',
        icon: t.type === 'topic' ? ['fas', 'book'] as [string, string] : ['fas', 'list-check'] as [string, string],
      })),
      ...this.objectiveService.getObjectives().map(o => ({
        id: o.id,
        type: 'objective',
        label: 'Objetivo',
        title: o.title,
        description: o.description || '',
        icon: ['fas', 'bullseye'] as [string, string],
      })),
      ...this.assignmentService.getAssignments().map(a => ({
        id: a.id,
        type: 'assignment',
        label: 'Assignment',
        title: a.title,
        description: `${a.course} — ${a.type}`,
        icon: ['fas', 'clipboard-list'] as [string, string],
      })),
      ...this.classNoteService.getNotes().map(n => ({
        id: n.id,
        type: 'note',
        label: 'Nota',
        title: n.title,
        description: n.course,
        icon: ['fas', 'book-open'] as [string, string],
      })),
      ...this.diagramService.getDiagrams().map(d => ({
        id: d.id,
        type: 'diagram',
        label: 'Diagrama',
        title: d.title,
        description: '',
        icon: ['fas', 'image'] as [string, string],
      })),
    ];
    this.allItems = items;
  }

  onInput(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search();
      this.cdr.markForCheck();
    }, 250);
  }

  search(): void {
    const q = this.query.toLowerCase().trim();
    if (!q) {
      this.results = [];
      this.showResults = false;
      return;
    }
    this.results = this.allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
    this.showResults = true;
  }

  close(): void {
    this.showResults = false;
    this.query = '';
    this.results = [];
  }

  get grouped(): { key: string; label: string; icon: [string, string]; items: SearchResult[] }[] {
    const groups = new Map<string, { label: string; icon: [string, string]; items: SearchResult[] }>();
    for (const r of this.results) {
      if (!groups.has(r.type)) {
        groups.set(r.type, { label: r.label, icon: r.icon, items: [] });
      }
      groups.get(r.type)!.items.push(r);
    }
    return Array.from(groups.entries()).map(([key, val]) => ({ key, ...val }));
  }
}
