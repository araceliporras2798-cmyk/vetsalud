import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mascotas } from './mascotas';

describe('Mascotas', () => {
  let component: Mascotas;
  let fixture: ComponentFixture<Mascotas>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Mascotas],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Mascotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});

describe('Mascotas · especie "Otro"', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Mascotas], providers: [provideRouter([])] }).compileComponents();
  });

  it('habilita y exige el campo de especie manual solo cuando se elige "Otro"', () => {
    const fixture = TestBed.createComponent(Mascotas);
    fixture.detectChanges();
    const c = fixture.componentInstance.formulario.controls;

    expect(c.especieOtra.enabled).toBe(false);

    c.especie.setValue('Otro');
    expect(c.especieOtra.enabled).toBe(true);
    expect(c.especieOtra.hasError('required')).toBe(true);

    c.especieOtra.setValue('Hámster');
    expect(c.especieOtra.valid).toBe(true);

    c.especie.setValue('Gato');
    expect(c.especieOtra.enabled).toBe(false);
  });
});
