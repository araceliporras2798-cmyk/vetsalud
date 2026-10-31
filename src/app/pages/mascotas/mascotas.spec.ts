import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mascotas } from './mascotas';

describe('Mascotas', () => {
  let component: Mascotas;
  let fixture: ComponentFixture<Mascotas>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Mascotas],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Mascotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
