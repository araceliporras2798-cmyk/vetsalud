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

describe('Historial · registro desde la cita y búsqueda', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('vetsalud_duenos', JSON.stringify([
      { id: 1, nombres: 'Ana', apellidos: 'Torres', dni: '12345678', telefono: '987654321', correo: '', direccion: 'Av. Lima 1' }
    ]));
    localStorage.setItem('vetsalud_mascotas', JSON.stringify([
      { id: 1, nombre: 'Rocky', especie: 'Perro', raza: 'Labrador', fechaNacimiento: '2021-01-01', sexo: 'Macho', peso: 20, color: 'Negro', observaciones: '', duenoId: 1 },
      { id: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', fechaNacimiento: '2022-01-01', sexo: 'Hembra', peso: 4, color: 'Crema', observaciones: '', duenoId: 1 }
    ]));
    localStorage.setItem('vetsalud_citas', JSON.stringify([
      { id: 7, mascotaId: 1, fecha: '2026-01-10', hora: '10:00', motivo: 'Vacunación', costo: 40, veterinario: 'Dra. Paz', estado: 'Confirmada', observaciones: '' }
    ]));
    await TestBed.configureTestingModule({ imports: [Historial], providers: [provideRouter([])] }).compileComponents();
  });

  it('al elegir la cita carga mascota y dueño, y al guardar la cita queda atendida', () => {
    const fixture = TestBed.createComponent(Historial);
    fixture.detectChanges();
    const h = fixture.componentInstance;

    h.formulario.controls.citaId.setValue(7);
    expect(h.mascotaDeCita?.nombre).toBe('Rocky');
    expect(h.duenoDeCita?.dni).toBe('12345678');

    h.formulario.controls.diagnostico.setValue('Paciente sano, apto para vacuna');
    h.registrarConsulta();

    expect(h.registros.length).toBe(1);
    expect(h.registros[0].tipoConsulta).toBe('Vacunación');
    expect(h.registros[0].costo).toBe(40);
    expect(h.citasPorAtender.length).toBe(0);
    expect(JSON.parse(localStorage.getItem('vetsalud_citas')!)[0].estado).toBe('Atendida');
  });

  it('la tabla se filtra por código o por nombre de la mascota', () => {
    localStorage.setItem('vetsalud_historial', JSON.stringify([
      { id: 1, mascotaId: 1, fecha: '2026-01-10', tipoConsulta: 'Vacunación', veterinario: 'Dra. Paz', diagnostico: 'Sano', tratamiento: '', observaciones: '', costo: 40 },
      { id: 2, mascotaId: 2, fecha: '2026-02-10', tipoConsulta: 'Control médico', veterinario: 'Dr. Ruiz', diagnostico: 'Sobrepeso', tratamiento: '', observaciones: '', costo: 35 }
    ]));
    const fixture = TestBed.createComponent(Historial);
    fixture.detectChanges();
    const h = fixture.componentInstance;

    expect(h.filas.length).toBe(2);
    h.busqueda.setValue('MAS-0002');
    expect(h.filas.map(f => f.mascota?.nombre)).toEqual(['Michi']);
    h.busqueda.setValue('rock');
    expect(h.filas.map(f => f.mascota?.nombre)).toEqual(['Rocky']);
    expect(h.totalCobrado).toBe(40);
  });
});
