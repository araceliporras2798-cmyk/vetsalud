import { TestBed } from '@angular/core/testing';
import { CitaService } from '../cita';
import { DuenoService } from '../dueno';
import { HistorialService } from '../historial';
import { MascotaService } from '../mascota';
import { Entidad, RepositorioLocal } from './repositorio-local';

describe('RepositorioLocal (herencia y polimorfismo)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('los cuatro servicios heredan de la clase abstracta', () => {
    const servicios: RepositorioLocal<Entidad>[] = [
      TestBed.inject(DuenoService),
      TestBed.inject(MascotaService),
      TestBed.inject(CitaService),
      TestBed.inject(HistorialService)
    ];
    servicios.forEach(servicio => expect(servicio).toBeInstanceOf(RepositorioLocal));
  });

  it('describir() es polimórfico: misma llamada, distinto resultado por servicio', () => {
    const duenos = TestBed.inject(DuenoService);
    const citas = TestBed.inject(CitaService);
    const repositorios: RepositorioLocal<Entidad>[] = [duenos, citas];

    const dueno = duenos.registrar({
      nombres: 'Ana', apellidos: 'Torres', dni: '12345678', telefono: '987654321', correo: '', direccion: 'Av. Lima 1'
    });
    const cita = citas.agendarCita({
      mascotaId: 1, fecha: '2099-01-01', hora: '10:00', motivo: 'Vacuna', costo: 50,
      veterinario: 'Dra. Paz', estado: 'Pendiente', observaciones: ''
    });

    expect(repositorios[0].describir(dueno)).toBe('Ana Torres (DNI 12345678)');
    expect(repositorios[1].describir(cita)).toBe('Vacuna del 2099-01-01 a las 10:00');
  });

  it('cada hijo aplica su propia regla de validación (sobrescritura)', () => {
    const duenos = TestBed.inject(DuenoService);
    const datos = { nombres: 'Luis', apellidos: 'Ríos', dni: '87654321', telefono: '912345678', correo: '', direccion: 'Jr. Ica 2' };
    duenos.registrar(datos);
    expect(() => duenos.registrar(datos)).toThrowError(/DNI/);
  });

  it('una cita atendida no se puede eliminar (validarEliminacion sobrescrito)', () => {
    const citas = TestBed.inject(CitaService);
    const cita = citas.agendarCita({
      mascotaId: 1, fecha: '2099-01-02', hora: '11:00', motivo: 'Control', costo: 50,
      veterinario: 'Dr. Salas', estado: 'Atendida', observaciones: ''
    });
    expect(() => citas.eliminarCita(cita.id)).toThrowError(/atendida/);
  });
});
