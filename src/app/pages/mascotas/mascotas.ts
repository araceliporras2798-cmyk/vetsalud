import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dueno, Mascota } from '../../models/mascota';
import { MascotaService } from '../../services/mascota';
import {
  ConfirmacionService,
  EdadMascotaPipe,
  FORMULARIO_SHARED,
  FechaUtil,
  NotificacionService,
  VetValidators
} from '../../shared';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [...FORMULARIO_SHARED, ReactiveFormsModule, EdadMascotaPipe],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css'
})
export class Mascotas {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'] as const;
  readonly hoy = FechaUtil.hoyISO();

  mostrarFormulario = false;
  duenos: Dueno[] = [];
  mascotas: Mascota[] = [];
  error = '';

  /** Buscador como FormControl independiente (estado reactivo del listado). */
  readonly busqueda = new FormControl('', { nonNullable: true });

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), VetValidators.noSoloEspacios]],
    especie: ['Perro', Validators.required],
    raza: ['', [Validators.required, Validators.maxLength(40), VetValidators.noSoloEspacios]],
    fechaNacimiento: ['', [Validators.required, VetValidators.fechaNoFutura]],
    sexo: ['Macho' as Mascota['sexo'], Validators.required],
    peso: [0, [Validators.required, Validators.min(0.1), Validators.max(150)]],
    color: ['', [Validators.required, Validators.maxLength(30), VetValidators.noSoloEspacios]],
    observaciones: ['', Validators.maxLength(250)],
    duenoId: [0, [Validators.required, Validators.min(1)]]
  });

  readonly c = this.formulario.controls;

  constructor() {
    this.actualizarDatos();
  }

  actualizarDatos(): void {
    this.duenos = this.mascotaService.obtenerDuenos();
    this.mascotas = this.mascotaService.obtenerMascotas();
  }

  get mascotasFiltradas(): Mascota[] {
    return this.mascotaService.buscarMascotas(this.busqueda.value);
  }

  nombreDueno(duenoId: number): string {
    const dueno = this.duenos.find(d => d.id === duenoId);
    return dueno ? `${dueno.nombres} ${dueno.apellidos}` : 'Sin dueño';
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.formulario.reset();
    }
  }

  registrarMascota(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Revisa los campos marcados en rojo y selecciona un dueño registrado.';
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      this.mascotaService.registrarMascota({
        ...datos,
        peso: Number(datos.peso),
        duenoId: Number(datos.duenoId),
        nombre: datos.nombre.trim(),
        raza: datos.raza.trim(),
        color: datos.color.trim(),
        observaciones: datos.observaciones.trim()
      });

      this.actualizarDatos();
      this.formulario.reset();
      this.mostrarFormulario = false;
      this.notificacion.exito(`${datos.nombre.trim()} ya forma parte de los pacientes.`, 'Mascota registrada');
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo registrar la mascota.';
    }
  }

  async eliminarMascota(mascota: Mascota): Promise<void> {
    const confirmado = await this.confirmacion.confirmar({
      titulo: 'Eliminar mascota',
      mensaje: `¿Deseas eliminar a ${this.mascotaService.describir(mascota)}?`,
      detalle: 'Sus citas e historial clínico quedarán sin paciente asociado.',
      textoConfirmar: 'Sí, eliminar'
    });

    if (confirmado && this.mascotaService.eliminarMascota(mascota.id)) {
      this.actualizarDatos();
      this.notificacion.exito('Mascota eliminada correctamente.');
      this.cdr.markForCheck();
    }
  }
}
