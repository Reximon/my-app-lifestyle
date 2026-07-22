import { ChangeDetectorRef, Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ObjectiveService } from '../../services/objective.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClassNoteService } from '../../services/class-note.service';
import { DiagramService } from '../../services/diagram.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dashboard',
  imports: [FaIconComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public pendingCount = 0;
  public completedCount = 0;
  public notesCount = 0;
  public diagramsCount = 0;
  public assignmentsPending = 0;
  public assignmentsDelivered = 0;
  public assignmentsReviewed = 0;
  public dailyDone = 0;
  public dailyTotal = 0;
  public upcomingDeadlines: Array<{ title: string; dueDate: string; source: string }> = [];

  constructor(
    private taskService: TaskService,
    private objectiveService: ObjectiveService,
    private assignmentService: AssignmentService,
    private classNoteService: ClassNoteService,
    private diagramService: DiagramService,
    private cdr: ChangeDetectorRef,
  ) {
    this.taskService.tasks$.subscribe(() => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

    this.objectiveService.objectives$.subscribe(() => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

    this.assignmentService.assignments$.subscribe(() => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

    this.classNoteService.classNotes$.subscribe(() => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

    this.diagramService.diagrams$.subscribe(() => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });
  }

  private computeMetrics(): void {
    const tasks = this.taskService.getTasks();
    this.pendingCount = tasks.filter(t => t.status === 'pendiente').length;
    this.completedCount = tasks.filter(t => t.status === 'completado').length;

    const daily = this.objectiveService.getObjectives().filter(o => o.scope === 'daily');
    this.dailyTotal = daily.length;
    this.dailyDone = daily.filter(o => o.status === 'completado').length;

    this.notesCount = this.classNoteService.getNotes().length;
    this.diagramsCount = this.diagramService.getDiagrams().length;

    const assignments = this.assignmentService.getAssignments();
    this.assignmentsPending = assignments.filter(a => a.status === 'pendiente').length;
    this.assignmentsDelivered = assignments.filter(a => a.status === 'entregado').length;
    this.assignmentsReviewed = assignments.filter(a => a.status === 'revisado').length;

    const today = new Date().toISOString().slice(0, 10);
    const allDeadlines = [
      ...this.taskService.getTasks()
        .filter(t => t.dueDate && t.dueDate >= today && t.status !== 'completado')
        .map(t => ({ title: t.title, dueDate: t.dueDate!, source: 'Tarea' })),
      ...this.assignmentService.getAssignments()
        .filter(a => a.dueDate && a.dueDate >= today && a.status !== 'revisado')
        .map(a => ({ title: a.title, dueDate: a.dueDate!, source: a.course })),
    ];
    this.upcomingDeadlines = allDeadlines
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }
}
