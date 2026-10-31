import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita';
import { Entidad, RepositorioLocal } from '../../services/base/repositorio-local';
import { DuenoService } from '../../services/dueno';
import { HistorialService } from '../../services/historial';
import { MascotaService } from '../../services/mascota';
import {
  EstadoCitaPipe,
  FechaLegiblePipe,
  FechaUtil,
  MonedaPipe,
  RangoHorarioPipe,
  ResaltarCitaProximaDirective,
  TarjetaResumen,
  TiempoRestantePipe
} from '../../shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    TarjetaResumen,
    FechaLegiblePipe,
    EstadoCitaPipe,
    TiempoRestantePipe,
    ResaltarCitaProximaDirective,
    MonedaPipe,
    RangoHorarioPipe
  ],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);
  private readonly historialService = inject(HistorialService);
  private readonly duenoService = inject(DuenoService);

  /**
   * POLIMORFISMO: los cuatro servicios se manejan con el tipo base RepositorioLocal.
   * La misma llamada (contar(), describir()) ejecuta la versión de cada servicio hijo.
   */
  private readonly repositorios: RepositorioLocal<Entidad>[] = [
    this.duenoService,
    this.mascotaService,
    this.citaService,
    this.historialService
  ];

  readonly ultimosRegistros = this.repositorios.map(repositorio => {
    const registros = repositorio.obtenerTodos();
    const ultimo = registros.reduce<Entidad | null>((mayor, r) => (!mayor || r.id > mayor.id ? r : mayor), null);
    return {
      entidad: repositorio.nombreEntidad,
      total: repositorio.contar(),
      descripcion: ultimo ? repositorio.describir(ultimo) : 'Sin registros todavía'
    };
  });

  readonly hoy = FechaUtil.hoyISO();
  readonly totalDuenos = this.duenoService.contar();
  readonly mascotas = this.mascotaService.obtenerMascotas();
  readonly totalConsultas = this.historialService.contar();
  readonly citas = this.citaService.obtenerCitas();
  readonly proximasCitas: Cita[] = this.citaService.obtenerProximas(this.hoy, 5);

  get citasHoy(): number {
    return this.citas.filter(c => c.fecha === this.hoy && c.estado !== 'Cancelada').length;
  }

  nombreMascota(id: number): string {
    return this.mascotas.find(m => m.id === id)?.nombre ?? 'Mascota';
  }

  ir(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
