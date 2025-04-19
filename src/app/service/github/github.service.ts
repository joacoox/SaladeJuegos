import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { urlGithub } from '../../helper/consts';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  
  httpClient = inject(HttpClient);
  userDataDisplay = signal<any>(null);

  getData(){
    const peticion: Observable<any> = this.httpClient.get<any>(urlGithub);
    console.log(urlGithub)
    const suscripcion: Subscription = peticion.subscribe((respuesta) => {
      this.userDataDisplay.set(respuesta); 
      suscripcion.unsubscribe();
    });
  }
}
