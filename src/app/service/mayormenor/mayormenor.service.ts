import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDeckResponse } from '../../types/deckResponse';
import { IDrawResponse } from '../../types/drawResponse';

@Injectable({
  providedIn: 'root'
})
export class MayormenorService {

  private baseUrl = 'https://deckofcardsapi.com/api/deck';
  private deckId: string = '';
  http = inject(HttpClient);

  shuffleDeck(deckCount: number = 1): Observable<IDeckResponse> {
    return this.http.get<IDeckResponse>(`${this.baseUrl}/new/shuffle/?deck_count=${deckCount}`);
  }

  drawCards(count: number): Observable<IDrawResponse> {
    if (!this.deckId) {
      throw new Error('Deck ID is not set. Shuffle the deck first.');
    }
    return this.http.get<IDrawResponse>(`${this.baseUrl}/${this.deckId}/draw/?count=${count}`);
  }

  setDeckId(deckId: string): void {
    this.deckId = deckId;
  }

  getDeckId(): string {
    return this.deckId;
  }
}
