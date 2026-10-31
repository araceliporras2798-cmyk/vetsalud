/** Servicios que ofrece la clínica, con su tarifa base en soles. */
export interface Servicio {
  nombre: string;
  costo: number;
  duracionMin: number;
}

export const SERVICIOS: readonly Servicio[] = [
  { nombre: 'Consulta general', costo: 50, duracionMin: 30 },
  { nombre: 'Vacunación', costo: 40, duracionMin: 30 },
  { nombre: 'Desparasitación', costo: 30, duracionMin: 30 },
  { nombre: 'Control médico', costo: 35, duracionMin: 30 },
  { nombre: 'Baño y peluquería', costo: 45, duracionMin: 30 },
  { nombre: 'Emergencia', costo: 120, duracionMin: 30 },
  { nombre: 'Cirugía', costo: 300, duracionMin: 30 }
] as const;

/** Horarios de atención predefinidos (bloques de 30 minutos de 08:00 a 19:30). */
export const DURACION_BLOQUE_MIN = 30;

export const HORARIOS: readonly string[] = Array.from({ length: 24 }, (_, i) => {
  const minutos = 8 * 60 + i * DURACION_BLOQUE_MIN;
  const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
  const mm = String(minutos % 60).padStart(2, '0');
  return `${hh}:${mm}`;
});

export function tarifaDe(servicio: string): number {
  return SERVICIOS.find(s => s.nombre === servicio)?.costo ?? 0;
}
