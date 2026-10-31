import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita';
import { HistorialService } from '../../services/historial';
import { MascotaService } from '../../services/mascota';
import {
  EstadoCitaPipe,
  FechaLegiblePipe,
  FechaUtil,
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
    ResaltarCitaProximaDirective
  ],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);
  private readonly historialService = inject(HistorialService);

  readonly hoy = FechaUtil.hoyISO();
  readonly totalDuenos = this.mascotaService.obtenerDuenos().length;
  readonly mascotas = this.mascotaService.obtenerMascotas();
  readonly totalConsultas = this.historialService.obtenerRegistros().length;
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
