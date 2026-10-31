import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cita } from '../../models/cita';
import { FechaUtil } from '../utils/fecha.util';
import { ResaltarCitaProximaDirective } from './resaltar-cita-proxima.directive';
import { SoloNumerosDirective } from './solo-numeros.directive';
import { ValidacionVisualDirective } from './validacion-visual.directive';

@Component({
  imports: [ResaltarCitaProximaDirective, SoloNumerosDirective, ValidacionVisualDirective, ReactiveFormsModule],
  template: `
    <div id="hoy" [appResaltarCitaProxima]="citaHoy"></div>
    <div id="pasada" [appResaltarCitaProxima]="citaPasada"></div>
    <div id="atendida" [appResaltarCitaProxima]="citaAtendida"></div>
    <input id="dni" [formControl]="dni" appSoloNumeros [maxDigitos]="8" appValidacionVisual>
  `
})
class Anfitrion {
  citaHoy: Pick<Cita, 'fecha' | 'hora' | 'estado'> = { fecha: FechaUtil.hoyISO(), hora: '23:59', estado: 'Pendiente' };
  citaPasada: Pick<Cita, 'fecha' | 'hora' | 'estado'> = { fecha: '2000-01-01', hora: '10:00', estado: 'Confirmada' };
  citaAtendida: Pick<Cita, 'fecha' | 'hora' | 'estado'> = { fecha: '2000-01-01', hora: '10:00', estado: 'Atendida' };
  dni = new FormControl('', { nonNullable: true, validators: Validators.required });
}

describe('Directivas personalizadas', () => {
  it('appResaltarCitaProxima aplica la clase según la cercanía de la cita', async () => {
    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('#hoy')?.classList).toContain('cita-hoy');
    expect(el.querySelector('#pasada')?.classList).toContain('cita-vencida');
    expect(el.querySelector('#atendida')?.className).toBe('');
  });

  it('appSoloNumeros elimina letras y limita la longitud', async () => {
    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#dni')!;

    input.value = '12ab345678999';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12345678');
    expect(fixture.componentInstance.dni.value).toBe('12345678');
  });

  it('appValidacionVisual refleja el estado del control con clases de Bootstrap', async () => {
    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#dni')!;

    expect(input.classList).not.toContain('is-invalid');

    fixture.componentInstance.dni.markAsTouched();
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(input.classList).toContain('is-invalid');

    input.value = '87654321';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(input.classList).toContain('is-valid');
  });
});
