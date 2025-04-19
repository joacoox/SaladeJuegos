import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BienvenidaComponent } from '../../../bienvenida/bienvenida.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-content',
  imports: [RouterOutlet, BienvenidaComponent, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent{
  router = inject(Router);

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
