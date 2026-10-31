import { EdadMascotaPipe } from './edad-mascota.pipe';
import { EstadoCitaPipe } from './estado-cita.pipe';
import { FechaLegiblePipe } from './fecha-legible.pipe';
import { TiempoRestantePipe } from './tiempo-restante.pipe';

describe('Pipes personalizados', () => {
  it('fechaLegible formatea en español sin desfase de zona horaria', () => {
    const pipe = new FechaLegiblePipe();
    expect(pipe.transform('2026-11-03', 'corta')).toBe('03/11/2026');
    expect(pipe.transform('2026-11-03', 'larga')).toContain('noviembre');
    expect(pipe.transform('')).toBe('—');
  });

  it('estadoCita devuelve texto, icono y clase de Bootstrap', () => {
    const pipe = new EstadoCitaPipe();
    expect(pipe.transform('Pendiente')).toContain('Pendiente');
    expect(pipe.transform('Atendida', 'clase')).toContain('text-bg-success');
    expect(pipe.transform('Cancelada', 'icono')).toBe('✖');
  });

  it('edadMascota calcula años y meses', () => {
    const pipe = new EdadMascotaPipe();
    const hoy = new Date(2026, 9, 30);
    expect(pipe.transform('2023-05-10', hoy)).toBe('3 años y 5 meses');
    expect(pipe.transform('2026-09-15', hoy)).toBe('1 mes');
    expect(pipe.transform('2030-01-01', hoy)).toBe('Sin dato');
  });

  it('tiempoRestante describe cuánto falta para la cita', () => {
    const pipe = new TiempoRestantePipe();
    const ahora = new Date(2026, 9, 30, 9, 0);
    expect(pipe.transform('2026-10-30', '09:30', ahora)).toBe('En 30 min');
    expect(pipe.transform('2026-10-31', '10:00', ahora)).toBe('Mañana');
    expect(pipe.transform('2026-10-29', '10:00', ahora)).toBe('Hora vencida');
  });
});
