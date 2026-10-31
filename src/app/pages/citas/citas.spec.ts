import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Citas } from './citas';

describe('Citas', () => {
  let component: Citas;
  let fixture: ComponentFixture<Citas>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Citas],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Citas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});

describe('Citas · formulario reactivo', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('vetsalud_citas', JSON.stringify([{
      id: 1, mascotaId: 1, fecha: '2099-03-01', hora: '10:00', motivo: 'Control',
      veterinario: 'Dra. Paz', estado: 'Pendiente', observaciones: ''
    }]));
    await TestBed.configureTestingModule({ imports: [Citas], providers: [provideRouter([])] }).compileComponents();
  });

  it('inicia inválido y marca el horario ocupado con un error de grupo', () => {
    const fixture = TestBed.createComponent(Citas);
    fixture.detectChanges();
    const form = fixture.componentInstance.formulario;

    expect(form.valid).toBe(false);

    form.patchValue({
      mascotaId: 1, fecha: '2099-03-01', hora: '10:00',
      motivo: 'Vacunación', veterinario: 'Carlos Pérez'
    });
    expect(form.hasError('horarioOcupado')).toBe(true);

    form.patchValue({ hora: '11:00' });
    expect(form.valid).toBe(true);
  });

  it('rechaza horas fuera del horario de atención', () => {
    const fixture = TestBed.createComponent(Citas);
    fixture.detectChanges();
    const hora = fixture.componentInstance.formulario.controls.hora;
    hora.setValue('22:30');
    expect(hora.hasError('fueraDeHorario')).toBe(true);
  });
});
