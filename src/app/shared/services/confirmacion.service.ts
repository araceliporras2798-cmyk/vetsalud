import { Injectable, signal } from '@angular/core';

export type TipoConfirmacion = 'danger' | 'warning' | 'primary';

export interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  detalle?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: TipoConfirmacion;
}

interface DialogoActivo extends Required<Omit<OpcionesConfirmacion, 'detalle'>> {
  detalle?: string;
  resolver: (respuesta: boolean) => void;
}

/**
 * Reemplaza al confirm() del navegador por un modal de Bootstrap.
 * Devuelve una Promise<boolean> para usarlo con async/await:
 *   if (await this.confirmacion.confirmar({ titulo, mensaje })) { ... }
 */
@Injectable({ providedIn: 'root' })
export class ConfirmacionService {
  private readonly activo = signal<DialogoActivo | null>(null);
  readonly dialogo = this.activo.asReadonly();

  confirmar(opciones: OpcionesConfirmacion): Promise<boolean> {
    this.responder(false); // cierra un diálogo previo, si lo hubiera

    return new Promise<boolean>(resolver => {
      this.activo.set({
        textoConfirmar: 'Confirmar',
        textoCancelar: 'Cancelar',
        tipo: 'danger',
        ...opciones,
        resolver
      });
    });
  }

  responder(respuesta: boolean): void {
    const dialogo = this.activo();
    if (dialogo) {
      this.activo.set(null);
      dialogo.resolver(respuesta);
    }
  }
}
