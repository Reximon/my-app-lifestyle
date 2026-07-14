import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../../services/task.service';
import { GoogleCalendar } from '../../services/google-calendar';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-actions-panel',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './actions-panel.html',
  styleUrl: './actions-panel.scss',
})
export class ActionsPanel {

  public selectedType: string = 'tarea';
  public title: string | undefined;
  public description: string | undefined;
  public dueDate: string | undefined;
  public instructor: string | undefined;
  public category: string | undefined;
  public content: string | undefined;
  public subject: string | undefined;

  constructor(
    private taskService: TaskService,
    private googleCalendar: GoogleCalendar,
  ) {}

  public async create() {
    const task: Task = {
      id: Date.now().toString(),
      type: this.selectedType as Task['type'],
      title: this.title || '',
      description: this.description,
      status: 'pendiente',
      dueDate: this.dueDate,
      createdAt: new Date().toISOString(),
    };

    this.taskService.addTask(task);

    if (this.googleCalendar.isConnected() && task.dueDate) {
      try {
        const body = {
          summary: task.title,
          description: task.description || '',
          start: { date: task.dueDate },
          end: { date: task.dueDate },
        };
        console.log('Google body', body);
        const event = await this.googleCalendar.createEvent(body);
        this.taskService.updateTasks(task.id, { googleEventId: event.id });
        console.log('Google event created:', event.id);
      } catch (e) {
        console.error('Google create failed', e);
      }
    }
  }


}
