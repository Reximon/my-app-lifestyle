import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Clock } from "./components/clock/clock";
import { ActionsPanel } from './components/actions-panel/actions-panel';
import { TodoWeek } from './components/todo-week/todo-week';
import { Pomodoro } from './components/pomodoro/pomodoro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Clock, ActionsPanel, TodoWeek, Pomodoro],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-academic-os');
}
