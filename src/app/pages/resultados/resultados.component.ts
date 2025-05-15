import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

interface IScore {
  id: number;
  scored_at: string;
  email_usuario: string;
  mejor_puntaje: number;
  time_left?: number;
}

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent {

  ahorcadoScores = signal<IScore[]>([]);
  preguntadosScores = signal<IScore[]>([]);
  mayorMenorScores = signal<IScore[]>([]);
  sudokuScores = signal<IScore[]>([]);
  supabase = inject(AuthService);

  ngOnInit(): void {

    this.loadAllScores();
  }
  private async loadAllScores() {
    
    const ah = await this.supabase.getScore('scoreAhorcado');
    this.ahorcadoScores.set(ah ?? []);

    const pr = await this.supabase.getScore('scorePreguntados');
    this.preguntadosScores.set(pr ?? []);
    
    const mm = await this.supabase.getScore('scoreMayorMenor');
    this.mayorMenorScores.set(mm ?? []);

    const su = await this.supabase.getScoreSudoku();
    this.sudokuScores.set(su ?? []);
  }
}
