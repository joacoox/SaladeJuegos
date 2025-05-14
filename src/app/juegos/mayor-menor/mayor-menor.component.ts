import { Component, inject, OnInit, signal } from '@angular/core';
import { ICard } from '../../types/card';
import { MayormenorService } from '../../service/mayormenor/mayormenor.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-mayor-menor',
  imports: [],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements OnInit{
  router = inject(Router);
  supabase = inject(AuthService);
  cards: ICard[] = [];
  currentCard = signal<ICard | undefined >(undefined);
  nextCard: ICard | null = null;
  score: number = 0;
  lives: number = 3;
  gameOver: boolean = false;
  deckService = inject(MayormenorService);


  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.deckService.shuffleDeck().subscribe(deckResponse => {
      this.deckService.setDeckId(deckResponse.deck_id);
      this.resetGameVariables();
      this.fetchNextCard();
    });
  }

  resetGameVariables(): void {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.cards = [];
    this.currentCard.set(undefined);
    this.nextCard = null;
  }

  fetchNextCard(): void {
    this.deckService.drawCards(2).subscribe(drawResponse => {
      this.cards = drawResponse.cards;
      this.currentCard.set(this.cards[0]);
      this.nextCard = this.cards[1];
    });
  }

  guessHigher(): void {
    this.checkGuess(true);
  }

  guessLower(): void {
    this.checkGuess(false);
  }

  checkGuess(isHigher: boolean): void {
    const currentCard = this.currentCard();
    if (currentCard && this.nextCard) {
      const currentCardValue = this.mapCardValueToNumber(currentCard.value);
      const nextCardValue = this.mapCardValueToNumber(this.nextCard.value);

      if ((isHigher && nextCardValue > currentCardValue) || (!isHigher && nextCardValue < currentCardValue)) {
        this.score += 1;
      } else {
        this.lives -= 1;
        if (this.lives <= 0) {
          this.gameOver = true;
          this.supabase.subirScoreMayorOMenor(this.score);
        }
      }

      this.currentCard.set(this.nextCard);
      if (!this.gameOver) {
        this.deckService.drawCards(1).subscribe(drawResponse => {
          this.nextCard = drawResponse.cards[0];
          if (drawResponse.remaining === 0) {
            this.gameOver = true;
            this.supabase.subirScoreMayorOMenor(this.score);
          }
        });
      }
    }
  }

  resetGame(): void {
    this.resetGameVariables();
    if (!this.deckService.getDeckId()) {
      this.startGame();
    } else {
      this.fetchNextCard();
    }
  }

  mapCardValueToNumber(value: string): number {
    const values: { [key: string]: number } = {
      'ACE': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'JACK': 11,
      'QUEEN': 12,
      'KING': 13
    };
    return values[value.toUpperCase()];
  }

  goTo(){
    this.router.navigateByUrl("/home/bienvenida");
  }
}
