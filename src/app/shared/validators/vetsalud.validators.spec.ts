import { FormControl, FormGroup } from '@angular/forms';
import { FechaUtil } from '../utils/fecha.util';
import { VetValidators } from './vetsalud.validators';

describe('VetValidators', () => {
  it('dni y celular peruanos', () => {
    expect(VetValidators.dni(new FormControl('12345678'))).toBeNull();
    expect(VetValidators.dni(new FormControl('1234567a'))).toEqual({ dni: true });
    expect(VetValidators.celularPeru(new FormControl('987654321'))).toBeNull();
    expect(VetValidators.celularPeru(new FormControl('187654321'))).toEqual({ celular: true });
  });

  it('soloLetras y noSoloEspacios', () => {
    expect(VetValidators.soloLetras(new FormControl('María José'))).toBeNull();
    expect(VetValidators.soloLetras(new FormControl('Ana123'))).toEqual({ soloLetras: true });
    expect(VetValidators.noSoloEspacios(new FormControl('   '))).toEqual({ soloEspacios: true });
  });

  it('fechas pasadas y futuras', () => {
    expect(VetValidators.fechaNoPasada(new FormControl('2000-01-01'))).toEqual({ fechaPasada: true });
    expect(VetValidators.fechaNoPasada(new FormControl(FechaUtil.hoyISO()))).toBeNull();
    expect(VetValidators.fechaNoFutura(new FormControl('2999-01-01'))).toEqual({ fechaFutura: true });
  });

  it('horario de atención', () => {
    const validador = VetValidators.horarioAtencion('08:00', '20:00');
    expect(validador(new FormControl('07:30'))).toBeTruthy();
    expect(validador(new FormControl('12:00'))).toBeNull();
  });

  it('horarioDisponible consulta la agenda a nivel de grupo', () => {
    const grupo = new FormGroup(
      { fecha: new FormControl('2099-05-05'), hora: new FormControl('09:00') },
      { validators: VetValidators.horarioDisponible((_, hora) => hora !== '09:00') }
    );
    expect(grupo.hasError('horarioOcupado')).toBe(true);
    grupo.patchValue({ hora: '10:00' });
    expect(grupo.valid).toBe(true);
  });
});
