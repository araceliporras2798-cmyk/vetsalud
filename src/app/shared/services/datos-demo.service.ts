import { Injectable } from '@angular/core';
import { Cita } from '../../models/cita';
import { RegistroClinico } from '../../models/historial';
import { Dueno, Mascota } from '../../models/mascota';
import { HORARIOS, tarifaDe } from '../../models/servicio';
import { FechaUtil } from '../utils/fecha.util';

/** Claves de localStorage que usa la aplicación. */
export const CLAVES_VETSALUD = [
  'vetsalud_duenos',
  'vetsalud_mascotas',
  'vetsalud_citas',
  'vetsalud_historial'
] as const;

/**
 * Carga un conjunto de datos de ejemplo para la demostración y la sustentación.
 * Las fechas se calculan a partir del día actual, así siempre hay citas de hoy,
 * próximas, vencidas y atenciones en el historial.
 */
@Injectable({ providedIn: 'root' })
export class DatosDemoService {
  hayDatos(): boolean {
    return CLAVES_VETSALUD.some(clave => {
      try {
        const valor = JSON.parse(localStorage.getItem(clave) ?? '[]');
        return Array.isArray(valor) && valor.length > 0;
      } catch {
        return false;
      }
    });
  }

  borrarTodo(): void {
    CLAVES_VETSALUD.forEach(clave => localStorage.removeItem(clave));
  }

  cargar(ahora: Date = new Date()): void {
    const dia = (desplazamiento: number): string => {
      const fecha = new Date(ahora);
      fecha.setDate(fecha.getDate() + desplazamiento);
      return FechaUtil.hoyISO(fecha);
    };

    const duenos: Dueno[] = [
      { id: 1, nombres: 'María Fernanda', apellidos: 'Rojas Quispe', dni: '45879612', telefono: '987456123', correo: 'maria.rojas@gmail.com', direccion: 'Av. Brasil 1450, Jesús María' },
      { id: 2, nombres: 'Carlos', apellidos: 'Huamán Torres', dni: '70214589', telefono: '956321478', correo: '', direccion: 'Jr. Huallaga 320, Cercado de Lima' },
      { id: 3, nombres: 'Lucía', apellidos: 'Paredes Vega', dni: '41236587', telefono: '912345678', correo: 'lucia.pv@hotmail.com', direccion: 'Calle Las Begonias 215, San Isidro' },
      { id: 4, nombres: 'Jorge Luis', apellidos: 'Mendoza Salas', dni: '72583691', telefono: '945678123', correo: 'jl.mendoza@outlook.com', direccion: 'Av. La Marina 2350, San Miguel' }
    ];

    const mascotas: Mascota[] = [
      { id: 1, nombre: 'Rocky', especie: 'Perro', raza: 'Labrador', fechaNacimiento: '2021-03-14', sexo: 'Macho', peso: 28.5, color: 'Dorado', observaciones: 'Alérgico al pollo', duenoId: 1 },
      { id: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', fechaNacimiento: '2023-07-02', sexo: 'Hembra', peso: 3.8, color: 'Crema', observaciones: '', duenoId: 2 },
      { id: 3, nombre: 'Luna', especie: 'Perro', raza: 'Shih Tzu', fechaNacimiento: '2025-12-20', sexo: 'Hembra', peso: 4.2, color: 'Blanco con marrón', observaciones: '', duenoId: 3 },
      { id: 4, nombre: 'Kiwi', especie: 'Ave', raza: 'Periquito', fechaNacimiento: '2024-05-11', sexo: 'Macho', peso: 0.1, color: 'Verde', observaciones: '', duenoId: 1 },
      { id: 5, nombre: 'Coco', especie: 'Cuy', raza: 'Peruano', fechaNacimiento: '2025-06-15', sexo: 'Macho', peso: 0.9, color: 'Marrón', observaciones: 'Especie registrada con la opción "Otro"', duenoId: 4 },
      { id: 6, nombre: 'Tobby', especie: 'Perro', raza: 'Beagle', fechaNacimiento: '2024-02-10', sexo: 'Macho', peso: 11.4, color: 'Tricolor', observaciones: '', duenoId: 4 }
    ];

    // Próximo bloque libre de hoy (si todavía queda alguno) para tener una cita "de hoy" por atender.
    const hoy = dia(0);
    const proximoBloque = HORARIOS.find(hora => (FechaUtil.horasHasta(hoy, hora, ahora) ?? -1) > 0.5);

    let id = 0;
    const cita = (mascotaId: number, fecha: string, hora: string, motivo: string, veterinario: string,
                  estado: Cita['estado'], observaciones = ''): Cita =>
      ({ id: ++id, mascotaId, fecha, hora, motivo, costo: tarifaDe(motivo), veterinario, estado, observaciones });

    const citas: Cita[] = [
      cita(1, dia(-230), '09:00', 'Desparasitación', 'Dra. Sofía Medina', 'Atendida'),
      cita(1, dia(-80), '11:00', 'Consulta general', 'Dr. Jorge Salas', 'Atendida'),
      cita(2, dia(-40), '16:00', 'Control médico', 'Dr. Jorge Salas', 'Atendida'),
      cita(1, dia(-2), '10:00', 'Vacunación', 'Dra. Sofía Medina', 'Atendida'),
      cita(5, dia(-1), '15:30', 'Consulta general', 'Dr. Jorge Salas', 'Atendida'),
      cita(2, dia(-1), '17:00', 'Baño y peluquería', 'Dra. Sofía Medina', 'Confirmada', 'El cliente no asistió'),
      cita(3, hoy, '08:30', 'Consulta general', 'Dra. Sofía Medina', 'Pendiente', 'Revisión de oído'),
      ...(proximoBloque ? [cita(6, hoy, proximoBloque, 'Vacunación', 'Dr. Jorge Salas', 'Confirmada')] : []),
      cita(4, dia(1), '09:00', 'Baño y peluquería', 'Dr. Jorge Salas', 'Confirmada'),
      cita(1, dia(1), '10:30', 'Control médico', 'Dra. Sofía Medina', 'Pendiente'),
      cita(5, dia(2), '11:00', 'Desparasitación', 'Dra. Sofía Medina', 'Pendiente'),
      cita(3, dia(3), '10:00', 'Baño y peluquería', 'Dra. Sofía Medina', 'Cancelada'),
      cita(2, dia(6), '15:30', 'Vacunación', 'Dr. Jorge Salas', 'Pendiente'),
      cita(6, dia(9), '12:00', 'Cirugía', 'Dr. Jorge Salas', 'Pendiente', 'Castración programada')
    ];

    const atencion = (citaId: number, diagnostico: string, tratamiento: string, observaciones = ''): RegistroClinico => {
      const c = citas.find(x => x.id === citaId)!;
      return {
        id: citaId, citaId, mascotaId: c.mascotaId, fecha: c.fecha, tipoConsulta: c.motivo,
        veterinario: c.veterinario, costo: c.costo, diagnostico, tratamiento, observaciones
      };
    };

    const historial: RegistroClinico[] = [
      atencion(1, 'Control rutinario sin hallazgos.', 'Antiparasitario oral (tableta 20-40 kg).'),
      atencion(2, 'Dermatitis alérgica leve en abdomen.', 'Shampoo de clorhexidina 2 veces por semana durante 3 semanas.', 'Evitar alimento con pollo.'),
      atencion(3, 'Ligero sobrepeso (3.8 kg).', 'Dieta light y juego diario de 15 minutos.'),
      atencion(4, 'Paciente sano, apto para vacuna antirrábica.', 'Vacuna antirrábica 1 ml SC. Próxima dosis en 1 año.'),
      atencion(5, 'Crecimiento excesivo de incisivos.', 'Limado dental y heno ilimitado en la dieta.', 'Control en 2 meses.')
    ];

    localStorage.setItem('vetsalud_duenos', JSON.stringify(duenos));
    localStorage.setItem('vetsalud_mascotas', JSON.stringify(mascotas));
    localStorage.setItem('vetsalud_citas', JSON.stringify(citas));
    localStorage.setItem('vetsalud_historial', JSON.stringify(historial));
  }
}
