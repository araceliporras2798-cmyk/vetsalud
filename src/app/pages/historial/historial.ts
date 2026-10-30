
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroClinico } from '../../models/historial';
import { Mascota } from '../../models/mascota';
import { HistorialService } from '../../services/historial';
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {
  mascotas: Mascota[] = [];
  registros: RegistroClinico[] = [];

  mascotaSeleccionada: number | null = null;

  mensaje = '';
  error = '';

  nuevoRegistro = {
    mascotaId: 0,
    fecha: '',
    tipoConsulta: '',
    veterinario: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  };

  constructor(
    private historialService: HistorialService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit(): void {
    this.nuevoRegistro.fecha = this.fechaActual();
    this.mascotas = this.mascotaService.obtenerMascotas();
    this.actualizarRegistros();
  }

  fechaActual(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  get registrosFiltrados(): RegistroClinico[] {
    if (this.mascotaSeleccionada === null) {
      return this.registros;
    }

    return this.registros.filter(
      registro => registro.mascotaId === this.mascotaSeleccionada
    );
  }

  get totalRegistros(): number {
    return this.registrosFiltrados.length;
  }

  get mascotasAtendidas(): number {
    return new Set(
      this.registrosFiltrados.map(registro => registro.mascotaId)
    ).size;
  }

  actualizarRegistros(): void {
    this.registros = this.historialService
      .obtenerRegistros()
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  obtenerNombreMascota(mascotaId: number): string {
    const mascota = this.mascotas.find(
      item => item.id === mascotaId
    );

    return mascota
      ? mascota.nombre
      : 'Mascota eliminada';
  }

  registrarConsulta(): void {
    this.mensaje = '';
    this.error = '';

    if (this.mascotas.length === 0) {
      this.error = 'Primero registra una mascota.';
      return;
    }

    if (
      !this.nuevoRegistro.mascotaId ||
      !this.nuevoRegistro.fecha ||
      !this.nuevoRegistro.tipoConsulta.trim() ||
      !this.nuevoRegistro.veterinario.trim() ||
      !this.nuevoRegistro.diagnostico.trim()
    ) {
      this.error = 'Completa los campos obligatorios.';
      return;
    }

    try {
      this.historialService.registrar({
        ...this.nuevoRegistro,
        mascotaId: Number(this.nuevoRegistro.mascotaId),
        tipoConsulta: this.nuevoRegistro.tipoConsulta.trim(),
        veterinario: this.nuevoRegistro.veterinario.trim(),
        diagnostico: this.nuevoRegistro.diagnostico.trim(),
        tratamiento: this.nuevoRegistro.tratamiento.trim(),
        observaciones: this.nuevoRegistro.observaciones.trim()
      });

      this.actualizarRegistros();

      this.nuevoRegistro = {
        mascotaId: 0,
        fecha: this.fechaActual(),
        tipoConsulta: '',
        veterinario: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
      };

      this.mensaje = 'Consulta registrada correctamente.';
    } catch {
      this.error = 'No se pudo registrar la consulta.';
    }
  }

  eliminarRegistro(registro: RegistroClinico): void {
    const eliminado = this.historialService.eliminar(registro.id);

    if (eliminado) {
      this.actualizarRegistros();
      this.mensaje = 'Registro eliminado correctamente.';
      this.error = '';
    }
  }
}
