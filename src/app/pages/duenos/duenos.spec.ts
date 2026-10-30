import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Duenos } from './duenos';

describe('Duenos', () => {
  let component: Duenos;
  let fixture: ComponentFixture<Duenos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Duenos],
    }).compileComponents();

    fixture = TestBed.createComponent(Duenos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
