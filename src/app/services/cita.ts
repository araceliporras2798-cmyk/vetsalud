import { Injectable } from '@angular/core';
import { Cita } from '../models/cita';
import { RepositorioLocal } from './base/repositorio-local';

/** Servicio de citas: hereda de RepositorioLocal<Cita>. */
@Injectable({
  providedIn: 'root'
})
export class CitaService extends RepositorioLocal<Cita> {
  protected readonly clave = 'vetsalud_citas';
  readonly nombreEntidad = 'cita';

  override describir(cita: Cita): string {
    return `${cita.motivo} del ${cita.fecha} a las ${cita.hora}`;
  }

  /** Regla propia: no se puede agendar en un horario ocupado. */
  protected override validar(datos: Omit<Cita, 'id'>): void {
    if (!this.estaDisponible(datos.fecha, datos.hora)) {
      throw new Error('Este horario ya está ocupado. Selecciona otra hora para la cita.');
    }
  }

  /** Regla propia: una cita ya atendida forma parte del historial y no se borra. */
  protected override validarEliminacion(cita: Cita): void {
    if (cita.estado === 'Atendida') {
      throw new Error('Una cita atendida no se puede eliminar; forma parte del historial de la mascota.');
    }
  }

  obtenerCitas(): Cita[] {
    return this.obtenerTodos();
  }

  obtenerCitasPorMascota(mascotaId: number): Cita[] {
    return this.obtenerCitas().filter(cita => cita.mascotaId === mascotaId);
  }

  /** Citas ordenadas cronológicamente (fecha y hora ascendente). */
  obtenerCitasOrdenadas(): Cita[] {
    return this.obtenerCitas().sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );
  }

  /** Próximas citas activas (no atendidas ni canceladas) desde una fecha. */
  obtenerProximas(desde: string, limite = 5): Cita[] {
    return this.obtenerCitasOrdenadas()
      .filter(cita =>
        cita.fecha >= desde &&
        cita.estado !== 'Atendida' &&
        cita.estado !== 'Cancelada'
      )
      .slice(0, limite);
  }

  /** Indica si un horario está libre (una cita cancelada libera su horario). */
  estaDisponible(fecha: string, hora: string): boolean {
    return !this.registros.some(cita =>
      cita.fecha === fecha &&
      cita.hora === hora &&
      cita.estado !== 'Cancelada'
    );
  }

  agendarCita(datos: Omit<Cita, 'id'>): Cita {
    return this.crear(datos);
  }

  cambiarEstado(id: number, estado: Cita['estado']): boolean {
    return this.actualizarParcial(id, { estado });
  }

  eliminarCita(id: number): boolean {
    return this.eliminar(id);
  }
}
