import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSemanalComponent } from './grafico-semanal.component';

describe('GraficoSemanalComponent', () => {
  let component: GraficoSemanalComponent;
  let fixture: ComponentFixture<GraficoSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoSemanalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
