import { ICard } from "./card";

export interface IDrawResponse {
    success: boolean;
    deck_id: string;
    cards: ICard[];
    remaining: number;
}