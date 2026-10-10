enum Rank {
    Ten = "10",
    Ace = "A",
    King = "K",
    Queen = "Q",
    Jack = "J",
    Nine = "9",
    Eight = "8",
    Seven = "7",
}

function getRank(some: string): Rank {
    if (Object.values(Rank).includes(some as Rank)) {
        return some as Rank;
    }
    let rank = Rank[some as keyof typeof Rank];
    if (rank === undefined) rank = Rank.Ten;
    return rank;
}

enum Suit {
    Spades = "♠",
    Hearts = "♥",
    Clubs = "♣",
    Diamonds = "♦",
}

function getSuit(some: string): Suit {
    if (Object.values(Suit).includes(some as Suit)) {
        return some as Suit;
    }
    let suit = Suit[some as keyof typeof Suit];
    if (suit === undefined) suit = Suit.Spades;
    return suit;
}

const Values: { [key: string]: number } = {
    Ten: 5,
    Ace: 4,
    King: 3,
    Queen: 2,
    Jack: 1,
    Nine: 0,
    Eight: 0,
    Seven: 0,
}

class Card {

    private readonly _rank: Rank;
    private readonly _suit: Suit;

    constructor(rank: Rank, suit: Suit) {
        this._rank = rank;
        this._suit = suit;
    }

    get value(): number {
        return Values[this._rank.toString()];
    }

    get suit(): Suit {
        return this._suit;
    }

    get rank(): Rank {
        return this._rank;
    }

    get number(): number {
        return Object.values(Rank).indexOf(this._rank);
    }
}

export { Rank, Suit, Card, getSuit, getRank }