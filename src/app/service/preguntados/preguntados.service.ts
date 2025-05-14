import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiPreguntados } from '../../helper/consts';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {


  private apiUrl = apiPreguntados;

  http = inject(HttpClient);

  getAllCountries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
