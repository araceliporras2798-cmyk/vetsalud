import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cita } from '../../models/cita';
import { RegistroClinico } from '../../models/historial';
import { Dueno, Mascota } from '../../models/mascota';
import { CitaService } from '../../services/cita';
import { DuenoService } from '../../services/dueno';
import { HistorialService } from '../../services/historial';
import { MascotaService } from '../../services/mascota';
import {
  CodigoMascotaPipe,
  ConfirmacionService,
  EdadMascotaPipe,
  FORMULARIO_SHARED,
  FechaLegiblePipe,
  FechaUtil,
  MonedaPipe,
  NotificacionService,
  RangoHorarioPipe,
  TarjetaResumen,
  VetValidators
} from '../../shared';

/** Fila de la tabla de atenciones con los datos ya resueltos. */
interface FilaHistorial {
  registro: RegistroClinico;
  mascota?: Mascota;
  dueno?: Dueno;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    ...FORMULARIO_SHARED,
    FechaLegiblePipe,
    EdadMascotaPipe,
    CodigoMascotaPipe,
    MonedaPipe,
    RangoHorarioPipe,
    TarjetaResumen
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly historialService = inject(HistorialService);
  private readonly mascotaService = inject(MascotaService);
  private readonly duenoService = inject(DuenoService);
  private readonly citaService = inject(CitaService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly hoy = FechaUtil.hoyISO();

  mascotas: Mascota[] = [];
  duenos: Dueno[] = [];
  citasPorAtender: Cita[] = [];
  registros: RegistroClinico[] = [];
  error = '';

  /** Buscador de la tabla: código de la mascota (MAS-0001) o su nombre. */
  readonly busqueda = new FormControl('', { nonNullable: true });

  /**
   * La atención se registra a partir de una CITA: al elegirla se cargan
   * automáticamente la mascota, el dueño, el servicio, el horario y el veterinario.
   */
  readonly formulario = this.fb.nonNullable.group({
    citaId: [0, [Validators.required, Validators.min(1)]],
    fecha: [FechaUtil.hoyISO(), [Validators.required, VetValidators.fechaNoFutura]],
    diagnostico: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(400), VetValidators.noSoloEspacios]],
    tratamiento: ['', Validators.maxLength(400)],
    observaciones: ['', Validators.maxLength(250)]
  });

  readonly c = this.formulario.controls;

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.mascotas = this.mascotaService.obtenerMascotas();
    this.duenos = this.duenoService.obtenerTodos();
    this.citasPorAtender = this.citaService
      .obtenerCitasOrdenadas()
      .filter(cita => cita.estado === 'Pendiente' || cita.estado === 'Confirmada');
    this.registros = this.historialService
      .obtenerRegistros()
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }

  // ------------------------------------------------ datos autocompletados de la cita
  get citaSeleccionada(): Cita | undefined {
    return this.citasPorAtender.find(cita => cita.id === this.c.citaId.value);
  }

  get mascotaDeCita(): Mascota | undefined {
    const cita = this.citaSeleccionada;
    return cita ? this.mascota(cita.mascotaId) : undefined;
  }

  get duenoDeCita(): Dueno | undefined {
    const mascota = this.mascotaDeCita;
    return mascota ? this.dueno(mascota.duenoId) : undefined;
  }

  mascota(id: number): Mascota | undefined {
    return this.mascotas.find(m => m.id === id);
  }

  dueno(id: number | undefined): Dueno | undefined {
    return this.duenos.find(d => d.id === id);
  }

  // ------------------------------------------------ tabla con buscador
  get filas(): FilaHistorial[] {
    const ids = new Set(this.mascotaService.buscarPorCodigoONombre(this.busqueda.value).map(m => m.id));
    const filtrar = this.busqueda.value.trim() !== '';

    return this.registros
      .filter(registro => !filtrar || ids.has(registro.mascotaId))
      .map(registro => {
        const mascota = this.mascota(registro.mascotaId);
        return { registro, mascota, dueno: this.dueno(mascota?.duenoId) };
      });
  }

  /** Si la búsqueda encuentra una sola mascota se muestra su ficha. */
  get mascotaBuscada(): Mascota | undefined {
    if (!this.busqueda.value.trim()) return undefined;
    const encontradas = this.mascotaService.buscarPorCodigoONombre(this.busqueda.value);
    return encontradas.length === 1 ? encontradas[0] : undefined;
  }

  get totalRegistros(): number {
    return this.filas.length;
  }

  get mascotasAtendidas(): number {
    return new Set(this.filas.map(f => f.registro.mascotaId)).size;
  }

  get totalCobrado(): number {
    return this.filas.reduce((suma, f) => suma + (f.registro.costo ?? 0), 0);
  }

  // ------------------------------------------------ acciones
  registrarConsulta(): void {
    this.error = '';
    const cita = this.citaSeleccionada;

    if (this.formulario.invalid || !cita) {
      this.formulario.markAllAsTouched();
      this.error = 'Selecciona una cita y completa el diagnóstico antes de guardar.';
      return;
    }

    const datos = this.formulario.getRawValue();

    try {
      this.historialService.registrar({
        citaId: cita.id,
        mascotaId: cita.mascotaId,
        fecha: datos.fecha,
        tipoConsulta: cita.motivo,
        veterinario: cita.veterinario,
        costo: cita.costo,
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        observaciones: datos.observaciones.trim()
      });

      // La cita pasa a "Atendida" y sale de la lista de citas por atender.
      this.citaService.cambiarEstado(cita.id, 'Atendida');

      this.cargarDatos();
      this.formulario.reset();
      this.notificacion.exito(
        `Se registró la atención de ${this.mascota(cita.mascotaId)?.nombre ?? 'la mascota'} y la cita quedó como atendida.`,
        'Consulta registrada'
      );
    } catch {
      this.error = 'No se pudo registrar la consulta.';
    }
  }

  async eliminarRegistro(registro: RegistroClinico): Promise<void> {
    const confirmado = await this.confirmacion.confirmar({
      titulo: 'Eliminar registro clínico',
      mensaje: `¿Eliminar "${this.historialService.describir(registro)}" de ${this.mascota(registro.mascotaId)?.nombre ?? 'la mascota'}?`,
      detalle: registro.citaId
        ? 'La cita asociada volverá al estado "Confirmada" para poder registrarla de nuevo.'
        : 'El historial clínico es información sensible: elimina solo registros ingresados por error.',
      textoConfirmar: 'Sí, eliminar'
    });

    if (confirmado && this.historialService.eliminar(registro.id)) {
      if (registro.citaId) {
        this.citaService.cambiarEstado(registro.citaId, 'Confirmada');
      }
      this.cargarDatos();
      this.notificacion.exito('Registro eliminado del historial.');
      this.cdr.markForCheck();
    }
  }
}
