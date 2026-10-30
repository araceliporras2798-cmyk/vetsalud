
import { Injectable } from '@angular/core';
import { RegistroClinico } from '../models/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private readonly clave = 'vetsalud_historial';

  private cargar(): RegistroClinico[] {
    try {
      const datos = localStorage.getItem(this.clave);
      if (!datos) return [];

      const resultado: unknown = JSON.parse(datos);
      return Array.isArray(resultado)
        ? resultado as RegistroClinico[]
        : [];
    } catch {
      return [];
    }
  }

  private registros: RegistroClinico[] = this.cargar();

  private guardar(): void {
    localStorage.setItem(
      this.clave,
      JSON.stringify(this.registros)
    );
  }

  obtenerRegistros(): RegistroClinico[] {
    return this.registros.map(registro => ({ ...registro }));
  }

  registrar(datos: Omit<RegistroClinico, 'id'>): RegistroClinico {
    const nuevo: RegistroClinico = {
      ...datos,
      id: this.registros.reduce(
        (mayor, registro) => Math.max(mayor, registro.id),
        0
      ) + 1
    };

    this.registros.push(nuevo);
    this.guardar();

    return { ...nuevo };
  }

  eliminar(id: number): boolean {
    const indice = this.registros.findIndex(
      registro => registro.id === id
    );

    if (indice === -1) return false;

    this.registros.splice(indice, 1);
    this.guardar();
    return true;
  }
}
