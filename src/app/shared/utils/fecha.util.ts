/**
 * Utilidades de fecha usadas por pipes, directivas, validadores y componentes.
 * Se trabaja con cadenas 'YYYY-MM-DD' y 'HH:mm' (formato de <input type="date|time">)
 * y se construyen fechas en hora local para evitar desfases por zona horaria.
 */
export type ClasificacionCita = 'hoy' | 'proxima' | 'futura' | 'vencida' | 'cerrada';

export class FechaUtil {
  /** Fecha de hoy en formato 'YYYY-MM-DD'. */
  static hoyISO(base: Date = new Date()): string {
    const mes = String(base.getMonth() + 1).padStart(2, '0');
    const dia = String(base.getDate()).padStart(2, '0');
    return `${base.getFullYear()}-${mes}-${dia}`;
  }

  /** Convierte 'YYYY-MM-DD' (+ 'HH:mm' opcional) en un Date local. */
  static aDate(fecha: string, hora = '00:00'): Date | null {
    const partesFecha = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha ?? '');
    const partesHora = /^(\d{2}):(\d{2})/.exec(hora ?? '');

    if (!partesFecha || !partesHora) {
      return null;
    }

    const [, anio, mes, dia] = partesFecha.map(Number);
    const [, horas, minutos] = partesHora.map(Number);
    const resultado = new Date(anio, mes - 1, dia, horas, minutos);

    return Number.isNaN(resultado.getTime()) ? null : resultado;
  }

  /** Diferencia en horas entre una fecha/hora y el momento actual. */
  static horasHasta(fecha: string, hora: string, ahora: Date = new Date()): number | null {
    const destino = FechaUtil.aDate(fecha, hora);
    return destino ? (destino.getTime() - ahora.getTime()) / 3_600_000 : null;
  }

  /** Clasifica una cita según su cercanía en el tiempo y su estado. */
  static clasificarCita(
    fecha: string,
    hora: string,
    estado: string,
    horasAviso = 48,
    ahora: Date = new Date()
  ): ClasificacionCita {
    if (estado === 'Atendida' || estado === 'Cancelada') {
      return 'cerrada';
    }

    const horas = FechaUtil.horasHasta(fecha, hora, ahora);

    if (horas === null) return 'futura';
    if (horas < 0) return 'vencida';
    if (fecha === FechaUtil.hoyISO(ahora)) return 'hoy';
    if (horas <= horasAviso) return 'proxima';
    return 'futura';
  }
}
