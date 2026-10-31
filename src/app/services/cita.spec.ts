import { TestBed } from '@angular/core/testing';
import { Cita } from '../models/cita';
import { CitaService } from './cita';

const base: Omit<Cita, 'id'> = {
  mascotaId: 1, fecha: '2099-01-10', hora: '10:00', motivo: 'Vacuna', costo: 50,
  veterinario: 'Dra. Paz', estado: 'Pendiente', observaciones: ''
};

describe('CitaService', () => {
  let service: CitaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaService);
  });

  it('agenda una cita y la persiste en localStorage', () => {
    service.agendarCita(base);
    expect(service.obtenerCitas().length).toBe(1);
    expect(localStorage.getItem('vetsalud_citas')).toContain('Vacuna');
  });

  it('rechaza un horario ocupado', () => {
    service.agendarCita(base);
    expect(service.estaDisponible('2099-01-10', '10:00')).toBe(false);
    expect(() => service.agendarCita(base)).toThrowError(/ocupado/);
  });

  it('una cita cancelada libera el horario', () => {
    const cita = service.agendarCita(base);
    service.cambiarEstado(cita.id, 'Cancelada');
    expect(service.estaDisponible('2099-01-10', '10:00')).toBe(true);
  });

  it('ordena las citas por fecha y hora', () => {
    service.agendarCita({ ...base, fecha: '2099-02-01' });
    service.agendarCita({ ...base, fecha: '2099-01-05', hora: '09:00' });
    const fechas = service.obtenerCitasOrdenadas().map(c => c.fecha);
    expect(fechas).toEqual(['2099-01-05', '2099-02-01']);
  });
});
