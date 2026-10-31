import { Injectable } from '@angular/core';
import { RegistroClinico } from '../models/historial';
import { RepositorioLocal } from './base/repositorio-local';

/** Servicio del historial clínico: hereda de RepositorioLocal<RegistroClinico>. */
@Injectable({
  providedIn: 'root'
})
export class HistorialService extends RepositorioLocal<RegistroClinico> {
  protected readonly clave = 'vetsalud_historial';
  readonly nombreEntidad = 'registro clínico';

  override describir(registro: RegistroClinico): string {
    return `${registro.tipoConsulta} del ${registro.fecha}`;
  }

  obtenerRegistros(): RegistroClinico[] {
    return this.obtenerTodos();
  }

  registrar(datos: Omit<RegistroClinico, 'id'>): RegistroClinico {
    return this.crear(datos);
  }
}
