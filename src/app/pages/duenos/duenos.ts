import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Dueno } from '../../models/mascota';
import { DuenoService } from '../../services/dueno';
import { MascotaService } from '../../services/mascota';
import { ConfirmacionService, FORMULARIO_SHARED, NotificacionService, VetValidators } from '../../shared';

@Component({
  selector: 'app-duenos',
  standalone: true,
  imports: [...FORMULARIO_SHARED],
  templateUrl: './duenos.html',
  styleUrl: './duenos.css'
})
export class Duenos {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly duenoService = inject(DuenoService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  duenos: Dueno[] = [];
  error = '';

  /** Formulario reactivo con validaciones síncronas y personalizadas. */
  readonly formulario = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60), VetValidators.noSoloEspacios, VetValidators.soloLetras]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60), VetValidators.noSoloEspacios, VetValidators.soloLetras]],
    dni: ['', [
      Validators.required,
      VetValidators.dni,
      VetValidators.valorUnico(() => this.duenos.map(d => d.dni), 'dniDuplicado')
    ]],
    telefono: ['', [Validators.required, VetValidators.celularPeru]],
    correo: ['', [Validators.email, Validators.maxLength(80)]],
    direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120), VetValidators.noSoloEspacios]]
  });

  readonly c = this.formulario.controls;

  constructor() {
    this.actualizarDuenos();
  }

  actualizarDuenos(): void {
    this.duenos = this.mascotaService.obtenerDuenos();
  }

  registrarDueno(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Revisa los campos marcados en rojo antes de guardar.';
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      this.mascotaService.registrarDueno({
        nombres: datos.nombres.trim(),
        apellidos: datos.apellidos.trim(),
        dni: datos.dni,
        telefono: datos.telefono,
        correo: datos.correo.trim(),
        direccion: datos.direccion.trim()
      });

      this.actualizarDuenos();
      this.formulario.reset();
      this.notificacion.exito(`Se registró a ${datos.nombres.trim()} ${datos.apellidos.trim()}.`, 'Propietario registrado');
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo registrar al propietario.';
    }
  }

  limpiar(): void {
    this.formulario.reset();
    this.error = '';
  }

  /** Pide confirmación con el modal de Bootstrap y elimina al propietario. */
  async eliminarDueno(dueno: Dueno): Promise<void> {
    this.error = '';

    const confirmado = await this.confirmacion.confirmar({
      titulo: 'Eliminar propietario',
      mensaje: `¿Deseas eliminar a ${this.duenoService.describir(dueno)}?`,
      detalle: 'Esta acción no se puede deshacer.',
      textoConfirmar: 'Sí, eliminar'
    });

    if (!confirmado) {
      return;
    }

    try {
      if (this.mascotaService.eliminarDueno(dueno.id)) {
        this.actualizarDuenos();
        this.formulario.controls.dni.updateValueAndValidity();
        this.notificacion.exito('Propietario eliminado correctamente.');
      }
    } catch (e) {
      this.notificacion.error(e instanceof Error ? e.message : 'No se pudo eliminar al propietario.');
    } finally {
      this.cdr.markForCheck(); // la vista es OnPush y la respuesta llega de forma asíncrona
    }
  }
}
