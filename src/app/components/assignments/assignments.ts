import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../../models/assignment.model';

@Component({
  selector: 'app-assignments',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './assignments.html',
  styleUrl: './assignments.scss',
})
export class Assignments {
  public assignments: Assignment[] = [];
  public showModal = false;
  public editAssignment: Assignment | null = null;
  public modalCourse = '';
  public modalType: Assignment['type'] = 'assignment';
  public modalTitle = '';
  public modalDescription = '';
  public modalDueDate = '';
  public modalStatus: Assignment['status'] = 'pendiente';

  constructor(
    private assignmentService: AssignmentService,
    private cdr: ChangeDetectorRef,
  ) {
    this.load();
    this.assignmentService.assignments$.subscribe(() => {
      this.load();
      this.cdr.markForCheck();
    });
  }

  private load(): void {
    this.assignments = this.assignmentService.getAssignments();
  }

  openAdd(): void {
    this.editAssignment = null;
    this.modalCourse = '';
    this.modalType = 'assignment';
    this.modalTitle = '';
    this.modalDescription = '';
    this.modalDueDate = '';
    this.modalStatus = 'pendiente';
    this.showModal = true;
  }

  openEdit(a: Assignment): void {
    this.editAssignment = a;
    this.modalCourse = a.course;
    this.modalType = a.type;
    this.modalTitle = a.title;
    this.modalDescription = a.description || '';
    this.modalDueDate = a.dueDate || '';
    this.modalStatus = a.status;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveModal(): void {
    const title = this.modalTitle.trim();
    if (!title) return;

    if (this.editAssignment) {
      this.assignmentService.updateAssignment(this.editAssignment.id, {
        course: this.modalCourse,
        type: this.modalType,
        title,
        description: this.modalDescription || undefined,
        dueDate: this.modalDueDate || undefined,
        status: this.modalStatus,
      });
    } else {
      const a: Assignment = {
        id: Date.now().toString(),
        course: this.modalCourse,
        type: this.modalType,
        title,
        description: this.modalDescription || undefined,
        dueDate: this.modalDueDate || undefined,
        status: this.modalStatus,
        createdAt: new Date().toISOString(),
      };
      this.assignmentService.addAssignment(a);
    }
    this.closeModal();
  }

  toggleStatus(a: Assignment): void {
    const newStatus: Assignment['status'] =
      a.status === 'entregado' ? 'pendiente' : a.status === 'revisado' ? 'pendiente' : 'entregado';
    this.assignmentService.updateAssignment(a.id, { status: newStatus });
  }

  deleteAssignment(id: string): void {
    this.assignmentService.deleteAssignment(id);
  }
}
