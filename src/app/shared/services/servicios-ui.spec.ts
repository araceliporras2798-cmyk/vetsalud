import { TestBed } from '@angular/core/testing';
import { ConfirmacionService } from './confirmacion.service';
import { NotificacionService } from './notificacion.service';

describe('Servicios de interfaz (modal y toasts de Bootstrap)', () => {
  it('ConfirmacionService resuelve la promesa con la respuesta del usuario', async () => {
    const servicio = TestBed.inject(ConfirmacionService);
    const promesa = servicio.confirmar({ titulo: 'Eliminar', mensaje: '¿Seguro?' });

    expect(servicio.dialogo()?.titulo).toBe('Eliminar');
    servicio.responder(true);

    await expect(promesa).resolves.toBe(true);
    expect(servicio.dialogo()).toBeNull();
  });

  it('NotificacionService agrega y cierra toasts', () => {
    const servicio = TestBed.inject(NotificacionService);
    servicio.exito('Guardado');
    servicio.error('Falló');

    expect(servicio.notificaciones().length).toBe(2);
    servicio.cerrar(servicio.notificaciones()[0].id);
    expect(servicio.notificaciones().length).toBe(1);
    expect(servicio.notificaciones()[0].tipo).toBe('danger');
  });
});
