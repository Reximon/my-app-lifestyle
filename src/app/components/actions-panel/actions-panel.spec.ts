import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsPanel } from './actions-panel';

describe('ActionsPanel', () => {
  let component: ActionsPanel;
  let fixture: ComponentFixture<ActionsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
