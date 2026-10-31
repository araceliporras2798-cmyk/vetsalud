import { Injectable } from '@angular/core';
import { Dueno } from '../models/mascota';
import { RepositorioLocal } from './base/repositorio-local';

/** Servicio de propietarios: hereda de RepositorioLocal<Dueno>. */
@Injectable({
  providedIn: 'root'
})
export class DuenoService extends RepositorioLocal<Dueno> {
  protected readonly clave = 'vetsalud_duenos';
  readonly nombreEntidad = 'propietario';

  /** Polimorfismo: forma propia de describir a un dueño. */
  override describir(dueno: Dueno): string {
    return `${dueno.nombres} ${dueno.apellidos} (DNI ${dueno.dni})`;
  }

  /** Regla propia: el DNI no se puede repetir. */
  protected override validar(datos: Omit<Dueno, 'id'>): void {
    if (this.existeDni(datos.dni)) {
      throw new Error('Ya existe un propietario registrado con ese DNI.');
    }
  }

  existeDni(dni: string): boolean {
    return this.registros.some(dueno => dueno.dni === dni.trim());
  }

  registrar(datos: Omit<Dueno, 'id'>): Dueno {
    return this.crear(datos);
  }
}
