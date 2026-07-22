import { ChangeDetectorRef, Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ObjectiveService } from '../../services/objective.service';
import { AssignmentService } from '../../services/assignment.service';
import { ClassNoteService } from '../../services/class-note.service';
import { DiagramService } from '../../services/diagram.service';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,FaIconComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  public pendingCount = 0;
  public completedCount = 0;
  public dailyDone = 0;
  public dailyTotal = 0;


  constructor (

    private taskService: TaskService,
    private objectiveService: ObjectiveService,
    private assignmentService: AssignmentService,
    private classNoteService: ClassNoteService,
    private diagramService: DiagramService,
    private cdr: ChangeDetectorRef,

  ){
    this.taskService.tasks$.subscribe(tasks => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

     this.objectiveService.objectives$.subscribe(objective => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

     this.assignmentService.assignments$.subscribe(assignment => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

     this.classNoteService.classNotes$.subscribe(classNote => {
      this.computeMetrics();
      this.cdr.markForCheck();
    });

     this.diagramService.diagrams$.subscribe(diagram => {
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

  }


}
