
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota, Dueno } from '../../models/mascota';
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css'
})
export class Mascotas {
  mostrarFormulario = false;
  terminoBusqueda = '';

  duenos: Dueno[] = [];
  mascotas: Mascota[] = [];

  mensaje = '';
  error = '';

  nuevaMascota = {
    nombre: '',
    especie: 'Perro',
    raza: '',
    fechaNacimiento: '',
    sexo: 'Macho' as 'Macho' | 'Hembra',
    peso: 0,
    color: '',
    observaciones: '',
    duenoId: 0
  };

  constructor(private mascotaService: MascotaService) {
    this.actualizarDatos();
  }

  actualizarDatos(): void {
    this.duenos = this.mascotaService.obtenerDuenos();
    this.mascotas = this.mascotaService.obtenerMascotas();
  }

  get mascotasFiltradas(): Mascota[] {
    const texto = this.terminoBusqueda.trim().toLowerCase();

    return this.mascotas.filter(mascota =>
      mascota.nombre.toLowerCase().includes(texto) ||
      mascota.especie.toLowerCase().includes(texto) ||
      mascota.raza.toLowerCase().includes(texto)
    );
  }

  registrarMascota(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.nuevaMascota.nombre.trim() ||
      !this.nuevaMascota.raza.trim() ||
      !this.nuevaMascota.fechaNacimiento ||
      !this.nuevaMascota.color.trim() ||
      this.nuevaMascota.peso <= 0 ||
      this.nuevaMascota.duenoId <= 0
    ) {
      this.error = 'Completa todos los campos y selecciona un dueño registrado.';
      return;
    }

    try {
      this.mascotaService.registrarMascota({
        ...this.nuevaMascota,
        nombre: this.nuevaMascota.nombre.trim(),
        raza: this.nuevaMascota.raza.trim(),
        color: this.nuevaMascota.color.trim(),
        observaciones: this.nuevaMascota.observaciones.trim()
      });

      this.actualizarDatos();
      this.mensaje = 'Mascota registrada correctamente.';
      this.nuevaMascota = {
        nombre: '',
        especie: 'Perro',
        raza: '',
        fechaNacimiento: '',
        sexo: 'Macho',
        peso: 0,
        color: '',
        observaciones: '',
        duenoId: 0
      };
      this.mostrarFormulario = false;
    } catch (e) {
      this.error = e instanceof Error
        ? e.message
        : 'No se pudo registrar la mascota.';
    }
  }

  eliminarMascota(id: number): void {
    const eliminado = this.mascotaService.eliminarMascota(id);

    if (eliminado) {
      this.actualizarDatos();
      this.mensaje = 'Mascota eliminada correctamente.';
      this.error = '';
    }
  }
}
