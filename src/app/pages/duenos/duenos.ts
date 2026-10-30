
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../models/mascota';
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-duenos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './duenos.html',
  styleUrl: './duenos.css'
})
export class Duenos {
  duenos: Dueno[] = [];

  mensaje = '';
  error = '';

  nuevoDueno = {
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  constructor(private mascotaService: MascotaService) {
    this.actualizarDuenos();
  }

  actualizarDuenos(): void {
    this.duenos = this.mascotaService.obtenerDuenos();
  }

  registrarDueno(): void {
    this.mensaje = '';
    this.error = '';

    const nombres = this.nuevoDueno.nombres.trim();
    const apellidos = this.nuevoDueno.apellidos.trim();
    const dni = this.nuevoDueno.dni.trim();
    const telefono = this.nuevoDueno.telefono.trim();
    const correo = this.nuevoDueno.correo.trim();
    const direccion = this.nuevoDueno.direccion.trim();

    if (!nombres || !apellidos || !dni || !telefono || !direccion) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      this.error = 'El DNI debe tener exactamente 8 números.';
      return;
    }

    try {
      this.mascotaService.registrarDueno({
        nombres,
        apellidos,
        dni,
        telefono,
        correo,
        direccion
      });

      this.actualizarDuenos();
      this.mensaje = 'Propietario registrado correctamente.';

      this.nuevoDueno = {
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        correo: '',
        direccion: ''
      };
    } catch (e) {
      this.error = e instanceof Error
        ? e.message
        : 'No se pudo registrar al propietario.';
    }
  }

  eliminarDueno(id: number): void {
    this.mensaje = '';
    this.error = '';

    const confirmado = confirm(
      '¿Estás seguro de que deseas eliminar este propietario?'
    );

    if (!confirmado) {
      return;
    }

    try {
      const eliminado = this.mascotaService.eliminarDueno(id);

      if (eliminado) {
        this.actualizarDuenos();
        this.mensaje = 'Propietario eliminado correctamente.';
      } else {
        this.error = 'No se encontró el propietario seleccionado.';
      }
    } catch (e) {
      this.error = e instanceof Error
        ? e.message
        : 'No se pudo eliminar al propietario.';
    }
  }
}
