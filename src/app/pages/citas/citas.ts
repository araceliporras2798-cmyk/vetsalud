import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cita } from '../../models/cita';
import { Mascota } from '../../models/mascota';
import { HORARIOS, SERVICIOS, tarifaDe } from '../../models/servicio';
import { CitaService } from '../../services/cita';
import { MascotaService } from '../../services/mascota';
import {
  ConfirmacionService,
  EstadoCitaPipe,
  FORMULARIO_SHARED,
  FechaLegiblePipe,
  FechaUtil,
  MonedaPipe,
  NotificacionService,
  RangoHorarioPipe,
  ResaltarCitaProximaDirective,
  TarjetaResumen,
  TiempoRestantePipe,
  VetValidators
} from '../../shared';

type FiltroEstado = Cita['estado'] | 'Todas';

export type EstadoHorario = 'libre' | 'ocupado' | 'pasado';

export interface BloqueHorario {
  hora: string;
  estado: EstadoHorario;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [
    ...FORMULARIO_SHARED,
    FechaLegiblePipe,
    EstadoCitaPipe,
    TiempoRestantePipe,
    MonedaPipe,
    RangoHorarioPipe,
    ResaltarCitaProximaDirective,
    TarjetaResumen
  ],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly mascotaService = inject(MascotaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  static readonly APERTURA = HORARIOS[0];
  static readonly CIERRE = HORARIOS[HORARIOS.length - 1];

  readonly apertura = Citas.APERTURA;
  readonly cierre = Citas.CIERRE;
  readonly estados: Cita['estado'][] = ['Pendiente', 'Confirmada', 'Atendida', 'Cancelada'];
  readonly servicios = SERVICIOS;

  mascotas: Mascota[] = [];
  citas: Cita[] = [];
  /** Bloques de horario del día elegido con su estado (libre, ocupado o pasado). */
  horarios: BloqueHorario[] = [];
  error = '';

  readonly filtroEstado = new FormControl<FiltroEstado>('Todas', { nonNullable: true });

  /**
   * Formulario reactivo de la cita.
   * - Validadores por campo (requerido, fecha no pasada, horario de atención, etc.)
   * - Validador de grupo: la combinación fecha + hora debe estar libre.
   */
  readonly formulario = this.fb.nonNullable.group(
    {
      mascotaId: [0, [Validators.required, Validators.min(1)]],
      fecha: [FechaUtil.hoyISO(), [Validators.required, VetValidators.fechaNoPasada]],
      hora: ['', [Validators.required, VetValidators.horarioAtencion(Citas.APERTURA, Citas.CIERRE)]],
      motivo: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(1), Validators.max(5000)]],
      veterinario: ['', [Validators.required, Validators.minLength(3), VetValidators.soloLetras]],
      observaciones: ['', Validators.maxLength(250)]
    },
    {
      validators: VetValidators.horarioDisponible(
        (fecha, hora) => this.citaService.estaDisponible(fecha, hora)
      )
    }
  );

  readonly c = this.formulario.controls;

  ngOnInit(): void {
    this.cargarDatos();

    // Control de estado: cada vez que cambia la fecha se recalcula la disponibilidad de horarios.
    this.c.fecha.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fecha => this.actualizarHorarios(fecha));

    // Al elegir el servicio se completa automáticamente su tarifa.
    this.c.motivo.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(servicio => this.c.costo.setValue(tarifaDe(servicio)));

    this.actualizarHorarios(this.c.fecha.value);
  }

  get fechaMinima(): string {
    return FechaUtil.hoyISO();
  }

  get totalCitas(): number {
    return this.citas.length;
  }

  get citasHoy(): number {
    const hoy = FechaUtil.hoyISO();
    return this.citas.filter(c => c.fecha === hoy && c.estado !== 'Cancelada').length;
  }

  get citasPendientes(): number {
    return this.citas.filter(c => c.estado === 'Pendiente' || c.estado === 'Confirmada').length;
  }

  get citasFiltradas(): Cita[] {
    const estado = this.filtroEstado.value;
    return estado === 'Todas' ? this.citas : this.citas.filter(c => c.estado === estado);
  }

  /** Mensaje del validador de grupo para mostrar bajo los campos de fecha y hora. */
  get errorHorario(): string | null {
    const errores = this.formulario.errors;
    if (!errores || !(this.c.hora.touched || this.c.hora.dirty)) return null;
    if (errores['horarioOcupado']) return 'Ese horario ya está reservado. Elige otra hora.';
    if (errores['horaPasada']) return 'La hora seleccionada ya pasó.';
    return null;
  }

  get horarioLibre(): boolean {
    return !!this.c.fecha.value && this.c.hora.valid && !this.formulario.errors;
  }

  get horariosLibres(): number {
    return this.horarios.filter(h => h.estado === 'libre').length;
  }

  cargarDatos(): void {
    this.mascotas = this.mascotaService.obtenerMascotas();
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.citas = this.citaService.obtenerCitasOrdenadas();
  }

  private actualizarHorarios(fecha: string): void {
    this.horarios = HORARIOS.map(hora => {
      const horas = FechaUtil.horasHasta(fecha, hora);
      const estado: EstadoHorario =
        horas !== null && horas < 0 ? 'pasado'
        : this.citaService.estaDisponible(fecha, hora) ? 'libre'
        : 'ocupado';
      return { hora, estado };
    });

    // Si la hora elegida dejó de estar libre, se limpia la selección.
    const elegida = this.horarios.find(h => h.hora === this.c.hora.value);
    if (elegida && elegida.estado !== 'libre') {
      this.c.hora.setValue('');
    }
  }

  seleccionarHora(bloque: BloqueHorario): void {
    if (bloque.estado !== 'libre') return;
    this.c.hora.setValue(bloque.hora);
    this.c.hora.markAsTouched();
  }

  agendarCita(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = this.errorHorario ?? 'Revisa los campos marcados en rojo antes de agendar.';
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      this.citaService.agendarCita({
        ...datos,
        mascotaId: Number(datos.mascotaId),
        costo: Number(datos.costo),
        veterinario: datos.veterinario.trim(),
        observaciones: datos.observaciones.trim(),
        estado: 'Pendiente'
      });

      this.cargarCitas();
      this.formulario.reset();
      this.actualizarHorarios(this.c.fecha.value);
      this.notificacion.exito(
        `${this.obtenerNombreMascota(Number(datos.mascotaId))} · ${datos.motivo} · ${datos.fecha} a las ${datos.hora}.`,
        'Cita agendada'
      );
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'No se pudo registrar la cita.';
    }
  }

  obtenerNombreMascota(mascotaId: number): string {
    return this.mascotas.find(m => m.id === mascotaId)?.nombre ?? 'Mascota no encontrada';
  }

  cambiarEstado(cita: Cita, estado: Cita['estado']): void {
    if (this.citaService.cambiarEstado(cita.id, estado)) {
      this.cargarCitas();
      this.actualizarHorarios(this.c.fecha.value);
      this.formulario.updateValueAndValidity();
      this.notificacion.mostrar('info', `La cita de ${this.obtenerNombreMascota(cita.mascotaId)} ahora está "${estado}".`, 'Estado actualizado');
      this.error = '';
    }
  }

  async eliminarCita(cita: Cita): Promise<void> {
    const confirmado = await this.confirmacion.confirmar({
      titulo: 'Eliminar cita',
      mensaje: `¿Eliminar la cita de ${this.obtenerNombreMascota(cita.mascotaId)}: ${this.citaService.describir(cita)}?`,
      detalle: 'Si solo se reprograma o el cliente no asistirá, es mejor cambiar el estado a "Cancelada".',
      textoConfirmar: 'Sí, eliminar'
    });

    if (!confirmado) {
      return;
    }

    try {
      if (this.citaService.eliminarCita(cita.id)) {
        this.cargarCitas();
        this.actualizarHorarios(this.c.fecha.value);
        this.formulario.updateValueAndValidity();
        this.notificacion.exito('Cita eliminada de la agenda.');
      }
    } catch (e) {
      this.notificacion.error(e instanceof Error ? e.message : 'No se pudo eliminar la cita.');
    } finally {
      this.cdr.markForCheck();
    }
  }
}
