import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Duenos } from './duenos';

describe('Duenos', () => {
  let component: Duenos;
  let fixture: ComponentFixture<Duenos>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Duenos],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Duenos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});

describe('Duenos · validaciones', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Duenos], providers: [provideRouter([])] }).compileComponents();
  });

  it('valida DNI, celular, correo y DNI duplicado', () => {
    const fixture = TestBed.createComponent(Duenos);
    const c = fixture.componentInstance.formulario.controls;

    c.dni.setValue('1234');
    expect(c.dni.hasError('dni')).toBe(true);
    c.telefono.setValue('812345678');
    expect(c.telefono.hasError('celular')).toBe(true);
    c.correo.setValue('correo-invalido');
    expect(c.correo.hasError('email')).toBe(true);

    fixture.componentInstance.formulario.setValue({
      nombres: 'Lucía', apellidos: 'Ramos', dni: '45678912',
      telefono: '987654321', correo: '', direccion: 'Jr. Unión 456'
    });
    fixture.componentInstance.registrarDueno();
    expect(fixture.componentInstance.duenos.length).toBe(1);

    c.dni.setValue('45678912');
    expect(c.dni.hasError('dniDuplicado')).toBe(true);
  });
});
