import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Historial } from './historial';

describe('Historial', () => {
  let component: Historial;
  let fixture: ComponentFixture<Historial>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Historial],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Historial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
