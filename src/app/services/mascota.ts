import { Injectable, inject } from '@angular/core';
import { Dueno, Mascota } from '../models/mascota';
import { RepositorioLocal } from './base/repositorio-local';
import { DuenoService } from './dueno';
import { codigoMascota } from '../shared/pipes/codigo-mascota.pipe';

/**
 * Servicio de mascotas: hereda de RepositorioLocal<Mascota>.
 * Usa DuenoService (composición) para validar que el dueño exista.
 */
@Injectable({
  providedIn: 'root'
})
export class MascotaService extends RepositorioLocal<Mascota> {
  protected readonly clave = 'vetsalud_mascotas';
  readonly nombreEntidad = 'mascota';

  private readonly duenoService = inject(DuenoService);

  override describir(mascota: Mascota): string {
    return `${mascota.nombre} (${mascota.especie}, ${mascota.raza})`;
  }

  /** Búsqueda exacta por código (MAS-0003 o 3) o nombre. */
  buscarPorCodigoONombre(termino: string): Mascota[] {
    const texto = termino.trim().toLowerCase();
    if (!texto) return this.obtenerMascotas();

    return this.obtenerMascotas().filter(mascota =>
      codigoMascota(mascota.id).toLowerCase() === texto ||
      String(mascota.id) === texto.replace(/^mas-0*/, '') ||
      mascota.nombre.toLowerCase().includes(texto)
    );
  }

  /** Regla propia: la mascota debe pertenecer a un dueño registrado. */
  protected override validar(datos: Omit<Mascota, 'id'>): void {
    if (!this.duenoService.buscarPorId(datos.duenoId)) {
      throw new Error('Debes registrar al dueño antes que a su mascota.');
    }
  }

  // ---------- Mascotas
  obtenerMascotas(): Mascota[] {
    return this.obtenerTodos();
  }

  buscarMascotas(termino: string): Mascota[] {
    const texto = termino.trim().toLowerCase();

    if (!texto) {
      return this.obtenerMascotas();
    }

    return this.obtenerMascotas().filter(mascota =>
      codigoMascota(mascota.id).toLowerCase().includes(texto) ||
      mascota.nombre.toLowerCase().includes(texto) ||
      mascota.especie.toLowerCase().includes(texto) ||
      mascota.raza.toLowerCase().includes(texto)
    );
  }

  registrarMascota(datos: Omit<Mascota, 'id'>): Mascota {
    return this.crear(datos);
  }

  eliminarMascota(id: number): boolean {
    return this.eliminar(id);
  }

  // ---------- Dueños (se delega en DuenoService)
  obtenerDuenos(): Dueno[] {
    return this.duenoService.obtenerTodos();
  }

  registrarDueno(datos: Omit<Dueno, 'id'>): Dueno {
    return this.duenoService.registrar(datos);
  }

  eliminarDueno(id: number): boolean {
    if (this.registros.some(mascota => mascota.duenoId === id)) {
      throw new Error('No se puede eliminar este propietario porque tiene mascotas registradas.');
    }
    return this.duenoService.eliminar(id);
  }
}
