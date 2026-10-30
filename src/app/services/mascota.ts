
import { Injectable } from '@angular/core';
import { Dueno, Mascota } from '../models/mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private readonly claveDuenos = 'vetsalud_duenos';
  private readonly claveMascotas = 'vetsalud_mascotas';

  private duenos: Dueno[] = this.cargarDatos<Dueno>(
    this.claveDuenos
  );

  private mascotas: Mascota[] = this.cargarDatos<Mascota>(
    this.claveMascotas
  );

  private siguienteDuenoId = this.obtenerSiguienteId(this.duenos);
  private siguienteMascotaId = this.obtenerSiguienteId(this.mascotas);

  private cargarDatos<T>(clave: string): T[] {
    try {
      const datos = localStorage.getItem(clave);

      if (!datos) {
        return [];
      }

      const resultado: unknown = JSON.parse(datos);

      return Array.isArray(resultado) ? resultado as T[] : [];
    } catch {
      return [];
    }
  }

  private guardarDatos(): void {
    localStorage.setItem(this.claveDuenos, JSON.stringify(this.duenos));
    localStorage.setItem(this.claveMascotas, JSON.stringify(this.mascotas));
  }

  private obtenerSiguienteId<T extends { id: number }>(
    registros: T[]
  ): number {
    return registros.reduce(
      (mayor, registro) => Math.max(mayor, registro.id),
      0
    ) + 1;
  }

  obtenerDuenos(): Dueno[] {
    return this.duenos.map(dueno => ({ ...dueno }));
  }

  obtenerMascotas(): Mascota[] {
    return this.mascotas.map(mascota => ({ ...mascota }));
  }

  buscarMascotas(termino: string): Mascota[] {
    const texto = termino.trim().toLowerCase();

    if (!texto) {
      return this.obtenerMascotas();
    }

    return this.mascotas.filter(mascota =>
      mascota.nombre.toLowerCase().includes(texto) ||
      mascota.especie.toLowerCase().includes(texto) ||
      mascota.raza.toLowerCase().includes(texto)
    );
  }

  registrarDueno(datos: Omit<Dueno, 'id'>): Dueno {
    const nuevoDueno: Dueno = {
      ...datos,
      id: this.siguienteDuenoId++
    };

    this.duenos.push(nuevoDueno);
    this.guardarDatos();

    return { ...nuevoDueno };
  }

  eliminarDueno(id: number): boolean {
    const tieneMascotas = this.mascotas.some(
      mascota => mascota.duenoId === id
    );

    if (tieneMascotas) {
      throw new Error(
        'No se puede eliminar este propietario porque tiene mascotas registradas.'
      );
    }

    const indice = this.duenos.findIndex(
      dueno => dueno.id === id
    );

    if (indice === -1) {
      return false;
    }

    this.duenos.splice(indice, 1);
    this.guardarDatos();

    return true;
  }

  registrarMascota(datos: Omit<Mascota, 'id'>): Mascota {
    const duenoExiste = this.duenos.some(
      dueno => dueno.id === datos.duenoId
    );

    if (!duenoExiste) {
      throw new Error(
        'Debes registrar al dueño antes que a su mascota.'
      );
    }

    const nuevaMascota: Mascota = {
      ...datos,
      id: this.siguienteMascotaId++
    };

    this.mascotas.push(nuevaMascota);
    this.guardarDatos();

    return { ...nuevaMascota };
  }

  eliminarMascota(id: number): boolean {
    const indice = this.mascotas.findIndex(
      mascota => mascota.id === id
    );

    if (indice === -1) {
      return false;
    }

    this.mascotas.splice(indice, 1);
    this.guardarDatos();

    return true;
  }
}
