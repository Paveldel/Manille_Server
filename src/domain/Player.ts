import { Card, Suit } from "./Card.ts";
import { v4 as uuidv4 } from 'uuid';

class Player {

    private readonly _username: string;
    private readonly _hand: Card[] = [];
    private readonly _id: string = uuidv4();

    public constructor(username: string) {
        this._username = username;
    }

    public get id(): string {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public getCardFromHand(index: number): Card {
        if (index >= this._hand.length || index < 0) {
            throw new Error("Invalid index in hand");
        }
        return this._hand[index];
    }

    public removeFromHand(card: Card): void {
        this._hand.splice(this._hand.indexOf(card), 1);
    }

    public getCardsInHand(): Card[] {
        return this._hand;
    }

    public addCardToHand(card: Card): void {
        this._hand.push(card);
    }

    public hasCardOfSuit(suit: Suit): boolean {
        return this._hand.find(c => c.suit === suit) !== undefined;
    }
}

export { Player }