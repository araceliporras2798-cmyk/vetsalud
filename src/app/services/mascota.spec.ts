import { TestBed } from '@angular/core/testing';
import { MascotaService } from './mascota';

const dueno = {
  nombres: 'Ana', apellidos: 'Torres', dni: '12345678',
  telefono: '987654321', correo: '', direccion: 'Av. Lima 123'
};

describe('MascotaService', () => {
  let service: MascotaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(MascotaService);
  });

  it('registra un dueño con id autoincremental', () => {
    const creado = service.registrarDueno(dueno);
    expect(creado.id).toBe(1);
    expect(service.obtenerDuenos().length).toBe(1);
  });

  it('no permite registrar una mascota sin dueño existente', () => {
    expect(() => service.registrarMascota({
      nombre: 'Rocky', especie: 'Perro', raza: 'Mestizo', fechaNacimiento: '2022-01-01',
      sexo: 'Macho', peso: 10, color: 'Negro', observaciones: '', duenoId: 99
    })).toThrowError(/registrar al dueño/);
  });

  it('busca mascotas por nombre, especie o raza', () => {
    const { id } = service.registrarDueno(dueno);
    service.registrarMascota({
      nombre: 'Michi', especie: 'Gato', raza: 'Siamés', fechaNacimiento: '2021-05-01',
      sexo: 'Hembra', peso: 4, color: 'Crema', observaciones: '', duenoId: id
    });
    expect(service.buscarMascotas('siam').length).toBe(1);
    expect(service.buscarMascotas('perro').length).toBe(0);
  });

  it('impide eliminar un dueño que tiene mascotas', () => {
    const { id } = service.registrarDueno(dueno);
    service.registrarMascota({
      nombre: 'Toby', especie: 'Perro', raza: 'Beagle', fechaNacimiento: '2020-03-03',
      sexo: 'Macho', peso: 12, color: 'Tricolor', observaciones: '', duenoId: id
    });
    expect(() => service.eliminarDueno(id)).toThrowError();
  });
});
