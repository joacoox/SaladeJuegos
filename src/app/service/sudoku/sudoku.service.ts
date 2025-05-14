import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { apiSudoku } from '../../helper/consts';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private apiUrl = apiSudoku;
  
  http = inject(HttpClient);

  getGrid(): Observable<{ value: number[][], solution: number[][] }> {
    return this.http.get<{ newboard: { grids: { value: number[][], solution: number[][] }[] } }>(this.apiUrl).pipe(
      map(response => response.newboard.grids[0])
    );
  }
}
