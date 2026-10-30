
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

  agendarCita(datos: Omit<Cita, 'id'>): Cita {
    const citas = this.obtenerCitas();

    const horarioOcupado = citas.some(cita =>
      cita.fecha === datos.fecha &&
      cita.hora === datos.hora &&
      cita.estado !== 'Cancelada'
    );

    if (horarioOcupado) {
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
