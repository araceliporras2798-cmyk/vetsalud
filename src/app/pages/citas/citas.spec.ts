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
      id: 1, mascotaId: 1, fecha: '2099-03-01', hora: '10:00', motivo: 'Control', costo: 50,
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
      motivo: 'Vacunación', costo: 50, veterinario: 'Carlos Pérez'
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

describe('Citas · horarios predefinidos y costo', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('vetsalud_citas', JSON.stringify([{
      id: 1, mascotaId: 1, fecha: '2099-03-01', hora: '09:00', motivo: 'Vacunación', costo: 40,
      veterinario: 'Dra. Paz', estado: 'Confirmada', observaciones: ''
    }]));
    await TestBed.configureTestingModule({ imports: [Citas], providers: [provideRouter([])] }).compileComponents();
  });

  it('al elegir el servicio se completa su tarifa', () => {
    const fixture = TestBed.createComponent(Citas);
    fixture.detectChanges();
    const c = fixture.componentInstance.formulario.controls;

    c.motivo.setValue('Cirugía');
    expect(c.costo.value).toBe(300);
    c.motivo.setValue('Vacunación');
    expect(c.costo.value).toBe(40);
  });

  it('marca como ocupado el horario que ya tiene una cita', () => {
    const fixture = TestBed.createComponent(Citas);
    fixture.detectChanges();
    const componente = fixture.componentInstance;

    componente.formulario.controls.fecha.setValue('2099-03-01');
    const bloque = componente.horarios.find(h => h.hora === '09:00');
    expect(bloque?.estado).toBe('ocupado');
    expect(componente.horarios.length).toBe(24);
    expect(componente.horariosLibres).toBe(23);
  });
});
