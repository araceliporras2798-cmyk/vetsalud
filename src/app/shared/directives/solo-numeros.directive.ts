import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Restringe un campo de texto a dígitos (DNI, teléfono) y limita su longitud.
 * Funciona con ReactiveForms: actualiza el FormControl asociado sin disparar bucles.
 *
 * Uso: <input formControlName="dni" appSoloNumeros [maxDigitos]="8">
 */
@Directive({
  selector: 'input[appSoloNumeros]',
  host: { inputmode: 'numeric', autocomplete: 'off' }
})
export class SoloNumerosDirective {
  @Input() maxDigitos: number | null = null;

  private readonly elemento = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly control = inject(NgControl, { optional: true, self: true });

  @HostListener('input')
  limpiar(): void {
    const actual = this.elemento.nativeElement.value;
    let limpio = actual.replace(/\D/g, '');

    if (this.maxDigitos) {
      limpio = limpio.slice(0, this.maxDigitos);
    }

    if (limpio !== actual) {
      this.elemento.nativeElement.value = limpio;
      this.control?.control?.setValue(limpio);
    }
  }

  @HostListener('keydown', ['$event'])
  bloquearLetras(evento: KeyboardEvent): void {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
    const esAtajo = evento.ctrlKey || evento.metaKey;

    if (!esAtajo && !teclasPermitidas.includes(evento.key) && evento.key.length === 1 && !/\d/.test(evento.key)) {
      evento.preventDefault();
    }
  }
}
