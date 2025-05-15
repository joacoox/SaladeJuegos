import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SudokuService } from '../../service/sudoku/sudoku.service';
import { Router } from '@angular/router';
import { Subscription, takeWhile, timer } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-sudoku',
  imports: [],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.css'
})
export class SudokuComponent implements OnInit, OnDestroy {
  board: number[][] = [];
  solution: number[][] = [];
  playerBoard: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  gameOver: boolean = false;
  gameWon: boolean = false;
  isLoading = signal<boolean>(true);
  sudokuService = inject(SudokuService);
  router = inject(Router);
  initialTime: number = 600; 
  timeLeft = signal<number>(this.initialTime);
  private countdownSubscription!: Subscription;
  supabase = inject(AuthService);

  ngOnInit(): void {
    this.fetchSudokuBoard();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private startCountdown(): void {
    this.countdownSubscription = timer(0, 1000).pipe(
      takeWhile(() => this.timeLeft() > 0)
    ).subscribe(() => {
      this.timeLeft.update(time => time - 1);
      if (this.timeLeft() === 0) {
        this.gameOver = true;
        this.gameWon = false;
        this.stopCountdown();
      }
    });
  }

  private stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  fetchSudokuBoard(): void {
    this.isLoading.set(true);
    this.sudokuService.getGrid().subscribe({
      next: (data) => {
        this.board = data.value;
        this.solution = data.solution;
        this.playerBoard = this.board;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching Sudoku board:', error);
        this.isLoading.set(false);
      }
    });
  }

  checkBoard(): void {
    this.gameOver = true;
    this.gameWon = true;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.playerBoard[i][j] !== this.solution[i][j]) {
          this.gameWon = false;
        }
      }
    }
      this.stopCountdown();
      this.supabase.subirScoreSudoku(5000, this.formattedTime);
  }

  newGame(): void {
    this.gameOver = false;
    this.gameWon = false;
    this.timeLeft.set(this.initialTime);
    this.startCountdown();
    this.fetchSudokuBoard();
  }

  compareBoards(row: number, col: number): boolean {
    return this.board[row][col] !== 0;
  }
  
  completeBoard(){
    this.playerBoard = this.solution;
  }

  updateCell(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value) || 0;
    
    this.playerBoard[row][col] = value;
  }
  goTo(){
    this.router.navigateByUrl("/home/bienvenida");
  }
}
