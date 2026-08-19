import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPeriodoComponent } from './grafico-periodo.component';

describe('GraficoPeriodoComponent', () => {
  let component: GraficoPeriodoComponent;
  let fixture: ComponentFixture<GraficoPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoPeriodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
