import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Dueno } from '../../models/mascota';
import { MascotaService } from '../../services/mascota';
import { FORMULARIO_SHARED, VetValidators } from '../../shared';

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

  duenos: Dueno[] = [];
  mensaje = '';
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
    this.mensaje = '';
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
      this.mensaje = 'Propietario registrado correctamente.';
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo registrar al propietario.';
    }
  }

  limpiar(): void {
    this.formulario.reset();
    this.error = '';
  }

  eliminarDueno(id: number): void {
    this.mensaje = '';
    this.error = '';

    if (!confirm('¿Estás seguro de que deseas eliminar este propietario?')) {
      return;
    }

    try {
      if (this.mascotaService.eliminarDueno(id)) {
        this.actualizarDuenos();
        this.formulario.controls.dni.updateValueAndValidity();
        this.mensaje = 'Propietario eliminado correctamente.';
      } else {
        this.error = 'No se encontró el propietario seleccionado.';
      }
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo eliminar al propietario.';
    }
  }
}
