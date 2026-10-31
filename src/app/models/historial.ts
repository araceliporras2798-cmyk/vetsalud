
export interface RegistroClinico {
  id: number;
  mascotaId: number;
  /** Cita desde la que se registró la atención. */
  citaId?: number;
  fecha: string;
  tipoConsulta: string;
  veterinario: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  /** Costo cobrado (tomado de la cita). */
  costo?: number;
}
