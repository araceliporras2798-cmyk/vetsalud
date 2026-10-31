import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegistroClinico } from '../../models/historial';
import { Mascota } from '../../models/mascota';
import { HistorialService } from '../../services/historial';
import { MascotaService } from '../../services/mascota';
import {
  ConfirmacionService,
  EdadMascotaPipe,
  FORMULARIO_SHARED,
  FechaLegiblePipe,
  FechaUtil,
  NotificacionService,
  TarjetaResumen,
  VetValidators
} from '../../shared';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [...FORMULARIO_SHARED, FechaLegiblePipe, EdadMascotaPipe, TarjetaResumen],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly historialService = inject(HistorialService);
  private readonly mascotaService = inject(MascotaService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly tiposConsulta = [
    'Consulta general', 'Vacunación', 'Desparasitación',
    'Control médico', 'Emergencia', 'Cirugía', 'Otro'
  ] as const;

  readonly hoy = FechaUtil.hoyISO();

  mascotas: Mascota[] = [];
  registros: RegistroClinico[] = [];
  error = '';

  /** Filtro del timeline: null = todas las mascotas. */
  readonly filtroMascota = new FormControl<number | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    mascotaId: [0, [Validators.required, Validators.min(1)]],
    fecha: [FechaUtil.hoyISO(), [Validators.required, VetValidators.fechaNoFutura]],
    tipoConsulta: ['', Validators.required],
    veterinario: ['', [Validators.required, Validators.minLength(3), VetValidators.soloLetras]],
    diagnostico: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(400), VetValidators.noSoloEspacios]],
    tratamiento: ['', Validators.maxLength(400)],
    observaciones: ['', Validators.maxLength(250)]
  });

  readonly c = this.formulario.controls;

  ngOnInit(): void {
    this.mascotas = this.mascotaService.obtenerMascotas();
    this.actualizarRegistros();
  }

  get mascotaSeleccionada(): Mascota | undefined {
    return this.mascotas.find(m => m.id === this.filtroMascota.value);
  }

  get registrosFiltrados(): RegistroClinico[] {
    const id = this.filtroMascota.value;
    return id === null ? this.registros : this.registros.filter(r => r.mascotaId === id);
  }

  get totalRegistros(): number {
    return this.registrosFiltrados.length;
  }

  get mascotasAtendidas(): number {
    return new Set(this.registrosFiltrados.map(r => r.mascotaId)).size;
  }

  get ultimaAtencion(): string {
    return this.registrosFiltrados[0]?.fecha ?? '';
  }

  actualizarRegistros(): void {
    this.registros = this.historialService
      .obtenerRegistros()
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }

  obtenerNombreMascota(mascotaId: number): string {
    return this.mascotas.find(m => m.id === mascotaId)?.nombre ?? 'Mascota eliminada';
  }

  registrarConsulta(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Revisa los campos marcados en rojo antes de guardar.';
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      this.historialService.registrar({
        ...datos,
        mascotaId: Number(datos.mascotaId),
        veterinario: datos.veterinario.trim(),
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        observaciones: datos.observaciones.trim()
      });

      this.actualizarRegistros();
      this.formulario.reset();
      this.notificacion.exito(`Se agregó al historial de ${this.obtenerNombreMascota(Number(datos.mascotaId))}.`, 'Consulta registrada');
    } catch {
      this.error = 'No se pudo registrar la consulta.';
    }
  }

  async eliminarRegistro(registro: RegistroClinico): Promise<void> {
    const confirmado = await this.confirmacion.confirmar({
      titulo: 'Eliminar registro clínico',
      mensaje: `¿Eliminar "${this.historialService.describir(registro)}" de ${this.obtenerNombreMascota(registro.mascotaId)}?`,
      detalle: 'El historial clínico es información sensible: elimina solo registros ingresados por error.',
      textoConfirmar: 'Sí, eliminar'
    });

    if (confirmado && this.historialService.eliminar(registro.id)) {
      this.actualizarRegistros();
      this.notificacion.exito('Registro eliminado del historial.');
      this.cdr.markForCheck();
    }
  }
}
