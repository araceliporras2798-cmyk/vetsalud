
import { Injectable } from '@angular/core';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly clave = 'vetsalud_citas';

  obtenerCitas(): Cita[] {
    try {
      const datos = localStorage.getItem(this.clave);
      return datos ? JSON.parse(datos) as Cita[] : [];
    } catch {
      return [];
    }
  }

  obtenerCitasPorMascota(mascotaId: number): Cita[] {
    return this.obtenerCitas().filter(
      cita => cita.mascotaId === mascotaId
    );
  }

  /** Citas ordenadas cronológicamente (fecha y hora ascendente). */
  obtenerCitasOrdenadas(): Cita[] {
    return this.obtenerCitas().sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );
  }

  /** Próximas citas activas (no atendidas ni canceladas) desde hoy. */
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
    return !this.obtenerCitas().some(cita =>
      cita.fecha === fecha &&
      cita.hora === hora &&
      cita.estado !== 'Cancelada'
    );
  }

  agendarCita(datos: Omit<Cita, 'id'>): Cita {
    const citas = this.obtenerCitas();

    if (!this.estaDisponible(datos.fecha, datos.hora)) {
      throw new Error(
        'Este horario ya está ocupado. Selecciona otra hora para la cita.'
      );
    }

    const nuevaCita: Cita = {
      ...datos,
      id: Date.now()
    };

    citas.push(nuevaCita);

    localStorage.setItem(
      this.clave,
      JSON.stringify(citas)
    );

    return nuevaCita;
  }

  cambiarEstado(
    id: number,
    estado: Cita['estado']
  ): boolean {
    const citas = this.obtenerCitas();

    const indice = citas.findIndex(
      cita => cita.id === id
    );

    if (indice === -1) {
      return false;
    }

    citas[indice] = {
      ...citas[indice],
      estado
    };

    localStorage.setItem(
      this.clave,
      JSON.stringify(citas)
    );

    return true;
  }

  eliminarCita(id: number): boolean {
    const citas = this.obtenerCitas();

    const actualizadas = citas.filter(
      cita => cita.id !== id
    );

    if (actualizadas.length === citas.length) {
      return false;
    }

    localStorage.setItem(
      this.clave,
      JSON.stringify(actualizadas)
    );

    return true;
  }
}
