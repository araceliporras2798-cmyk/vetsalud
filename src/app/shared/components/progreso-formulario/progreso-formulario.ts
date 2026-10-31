import { ChangeDetectorRef, Component, DestroyRef, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Barra de progreso (Bootstrap) que refleja el estado de un FormGroup:
 * porcentaje de campos válidos y si el formulario está listo para enviarse.
 *  <app-progreso-formulario [formulario]="form" />
 */
@Component({
  selector: 'app-progreso-formulario',
  template: `
    <div class="progreso" aria-live="polite">
      <div class="d-flex justify-content-between small mb-1">
        <span class="text-secondary">Campos válidos: {{ validos }} de {{ total }}</span>
        <span class="fw-semibold" [class.text-success]="formulario.valid" [class.text-secondary]="!formulario.valid">
          {{ formulario.valid ? 'Listo para guardar' : (validos === total ? 'Revisa la combinación de datos' : porcentaje + '%') }}
        </span>
      </div>
      <div class="progress" role="progressbar" style="height: 8px"
           [attr.aria-valuenow]="porcentaje" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"
             [class.bg-success]="formulario.valid"
             [class.bg-info]="!formulario.valid"
             [style.width.%]="porcentaje"></div>
      </div>
    </div>
  `,
  styles: `:host { display: block; margin: 4px 0 20px; }`
})
export class ProgresoFormulario {
  private readonly cdr = inject(ChangeDetectorRef);
  private suscripcion?: Subscription;
  private _formulario!: FormGroup;

  /** Se escucha `formulario.events` para refrescar la barra (componente OnPush). */
  @Input({ required: true })
  set formulario(formulario: FormGroup) {
    this._formulario = formulario;
    this.suscripcion?.unsubscribe();
    this.suscripcion = formulario.events.subscribe(() => this.cdr.markForCheck());
  }
  get formulario(): FormGroup {
    return this._formulario;
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.suscripcion?.unsubscribe());
  }

  get total(): number {
    return Object.keys(this.formulario.controls).length;
  }

  get validos(): number {
    return Object.values(this.formulario.controls).filter(control => control.valid).length;
  }

  get porcentaje(): number {
    return this.total ? Math.round((this.validos / this.total) * 100) : 0;
  }
}
