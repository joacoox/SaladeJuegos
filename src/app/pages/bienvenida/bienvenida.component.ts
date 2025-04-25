import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {
  router = inject(Router);

  juegos = [
    { nombre: 'Ahorcado', ruta: 'ahorcado', icono: '🤐'},
    { nombre: 'Preguntados', ruta: 'preguntados', icono: '❓'},
    { nombre: 'Mayor o Menor', ruta: 'mayor-menor', icono: '📈'},
    { nombre: 'Sudoku', ruta: 'sudoku', icono: '🔢'}
  ];

  irAJuego(ruta: string): void {
    this.router.navigateByUrl(ruta);
  }
}
