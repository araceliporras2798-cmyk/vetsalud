
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cita } from '../../models/cita';
import { Mascota } from '../../models/mascota';
import { CitaService } from '../../services/cita';
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  mascotas: Mascota[] = [];
  citas: Cita[] = [];

  mensaje = '';
  error = '';

  nuevaCita = {
    mascotaId: 0,
    fecha: '',
    hora: '',
    motivo: '',
    veterinario: '',
    estado: 'Pendiente' as Cita['estado'],
    observaciones: ''
  };

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit(): void {
    this.nuevaCita.fecha = this.fechaMinima;
    this.cargarDatos();
  }

  get totalCitas(): number {
    return this.citas.length;
  }

  get fechaMinima(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  cargarDatos(): void {
    this.mascotas = this.mascotaService.obtenerMascotas();
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.citas = this.citaService.obtenerCitas();
  }

  agendarCita(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.nuevaCita.mascotaId ||
      !this.nuevaCita.fecha ||
      !this.nuevaCita.hora ||
      !this.nuevaCita.motivo.trim() ||
      !this.nuevaCita.veterinario.trim()
    ) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (this.nuevaCita.fecha < this.fechaMinima) {
      this.error = 'La fecha de la cita no puede estar en el pasado.';
      return;
    }

    try {
      this.citaService.agendarCita({
        ...this.nuevaCita,
        mascotaId: Number(this.nuevaCita.mascotaId),
        motivo: this.nuevaCita.motivo.trim(),
        veterinario: this.nuevaCita.veterinario.trim(),
        observaciones: this.nuevaCita.observaciones.trim()
      });

      this.mensaje = 'La cita se registró correctamente.';

      this.nuevaCita = {
        mascotaId: 0,
        fecha: this.fechaMinima,
        hora: '',
        motivo: '',
        veterinario: '',
        estado: 'Pendiente',
        observaciones: ''
      };

      this.cargarDatos();
    } catch (error: unknown) {
      this.error = error instanceof Error
        ? error.message
        : 'No se pudo registrar la cita.';
    }
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas.find(
      item => item.id === mascotaId
    );

    return mascota
      ? mascota.nombre
      : 'Mascota no encontrada';
  }

  cambiarEstado(cita: Cita, estado: Cita['estado']): void {
    const actualizado = this.citaService.cambiarEstado(
      cita.id,
      estado
    );

    if (actualizado) {
      this.cargarCitas();
      this.mensaje = 'Estado de la cita actualizado.';
      this.error = '';
    }
  }

  cancelarCita(cita: Cita): void {
    if (cita.estado === 'Cancelada') {
      return;
    }

    this.cambiarEstado(cita, 'Cancelada');
  }

  eliminarCita(cita: Cita): void {
    const eliminado = this.citaService.eliminarCita(cita.id);

    if (eliminado) {
      this.cargarCitas();
      this.mensaje = 'Cita eliminada correctamente.';
      this.error = '';
    }
  }
}
