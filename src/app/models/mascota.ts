
export interface Dueno {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: 'Macho' | 'Hembra';
  peso: number;
  color: string;
  observaciones: string;
  duenoId: number;
}
