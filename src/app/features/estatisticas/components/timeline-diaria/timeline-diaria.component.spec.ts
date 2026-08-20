import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDiariaComponent } from './timeline-diaria.component';

describe('TimelineDiariaComponent', () => {
  let component: TimelineDiariaComponent;
  let fixture: ComponentFixture<TimelineDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineDiariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
