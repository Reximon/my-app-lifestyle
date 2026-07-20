import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassNotes } from './class-notes';

describe('ClassNotes', () => {
  let component: ClassNotes;
  let fixture: ComponentFixture<ClassNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
