import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContenedorToasts } from './shared/components/contenedor-toasts/contenedor-toasts';
import { DialogoConfirmacion } from './shared/components/dialogo-confirmacion/dialogo-confirmacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DialogoConfirmacion, ContenedorToasts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
