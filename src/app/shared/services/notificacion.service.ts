import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'success' | 'danger' | 'warning' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
}

/** Notificaciones tipo "toast" de Bootstrap que se cierran solas. */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly lista = signal<Notificacion[]>([]);
  readonly notificaciones = this.lista.asReadonly();

  private siguienteId = 1;
  private readonly duracionMs = 4000;

  mostrar(tipo: TipoNotificacion, mensaje: string, titulo = 'VetSalud'): void {
    const id = this.siguienteId++;
    this.lista.update(actuales => [...actuales, { id, tipo, titulo, mensaje }].slice(-4));
    setTimeout(() => this.cerrar(id), this.duracionMs);
  }

  exito(mensaje: string, titulo = 'Operación exitosa'): void {
    this.mostrar('success', mensaje, titulo);
  }

  error(mensaje: string, titulo = 'No se pudo completar'): void {
    this.mostrar('danger', mensaje, titulo);
  }

  cerrar(id: number): void {
    this.lista.update(actuales => actuales.filter(n => n.id !== id));
  }
}
