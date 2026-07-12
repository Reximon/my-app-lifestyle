import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-actions-panel',
  imports: [FormsModule],
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

  constructor(private taskService: TaskService) {}

  public create(){
    const task: Task ={
        id: Date.now().toString(),
        type: this.selectedType as Task['type'],
        title: this.title || '',
        description: this.description,
        status: 'pendiente',
        dueDate: this.dueDate,
        createdAt: new Date().toISOString()
    }

    this.taskService.addTask(task);
  }


}
