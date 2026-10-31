import { TestBed } from '@angular/core/testing';
import { HistorialService } from './historial';

describe('HistorialService', () => {
  let service: HistorialService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialService);
  });

  it('registra y elimina atenciones clínicas', () => {
    const registro = service.registrar({
      mascotaId: 1, fecha: '2026-10-01', tipoConsulta: 'Vacunación', veterinario: 'Dr. Ruiz',
      diagnostico: 'Paciente sano', tratamiento: 'Vacuna séxtuple', observaciones: ''
    });
    expect(service.obtenerRegistros().length).toBe(1);
    expect(service.eliminar(registro.id)).toBe(true);
    expect(service.obtenerRegistros().length).toBe(0);
  });
});
