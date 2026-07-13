import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoWeek } from './todo-week';

describe('TodoWeek', () => {
  let component: TodoWeek;
  let fixture: ComponentFixture<TodoWeek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoWeek],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoWeek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
