import { TestBed } from '@angular/core/testing';
import { DatosDemoService } from './datos-demo.service';

describe('DatosDemoService', () => {
  beforeEach(() => localStorage.clear());

  it('carga datos coherentes de ejemplo y los puede borrar', () => {
    const servicio = TestBed.inject(DatosDemoService);
    expect(servicio.hayDatos()).toBe(false);

    servicio.cargar(new Date(2026, 9, 31, 9, 0));
    const citas = JSON.parse(localStorage.getItem('vetsalud_citas')!);
    const historial = JSON.parse(localStorage.getItem('vetsalud_historial')!);

    expect(servicio.hayDatos()).toBe(true);
    expect(JSON.parse(localStorage.getItem('vetsalud_mascotas')!).length).toBe(6);
    expect(citas.every((c: { costo: number }) => c.costo > 0)).toBe(true);
    expect(historial.every((h: { citaId: number }) => citas.some((c: { id: number; estado: string }) => c.id === h.citaId && c.estado === 'Atendida'))).toBe(true);

    servicio.borrarTodo();
    expect(servicio.hayDatos()).toBe(false);
  });
});
