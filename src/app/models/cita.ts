
export interface Cita {
  id: number;
  mascotaId: number;
  fecha: string;
  hora: string;
  /** Servicio solicitado (Consulta general, Vacunación, ...). */
  motivo: string;
  /** Costo de la cita en soles (S/). */
  costo: number;
  veterinario: string;
  estado: 'Pendiente' | 'Confirmada' | 'Atendida' | 'Cancelada';
  observaciones: string;
}
