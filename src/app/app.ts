import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Clock } from "./components/clock/clock";
import { ActionsPanel } from './components/actions-panel/actions-panel';
import { TodoWeek } from './components/todo-week/todo-week';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Clock, ActionsPanel, TodoWeek],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-academic-os');
}
