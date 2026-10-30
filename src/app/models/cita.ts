
export interface Cita {
  id: number;
  mascotaId: number;
  fecha: string;
  hora: string;
  motivo: string;
  veterinario: string;
  estado: 'Pendiente' | 'Confirmada' | 'Atendida' | 'Cancelada';
  observaciones: string;
}
