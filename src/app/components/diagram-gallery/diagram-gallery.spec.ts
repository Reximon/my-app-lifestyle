import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramGallery } from './diagram-gallery';

describe('DiagramGallery', () => {
  let component: DiagramGallery;
  let fixture: ComponentFixture<DiagramGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
