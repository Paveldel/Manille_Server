import { Card, Suit, Rank } from "./Card.ts";
import { v4 as uuidv4 } from 'uuid';
import { Player } from "./Player.ts";

const amountOfPlayersInGame = 4;
const draw = 30;
const amountOfPointsToWin = 101;

interface GameInfo {
    indexOfPlayer: number,
    gameState: string,
    players: string[],
    hand: Card[],
    firstTeamPoints: number,
    secondTeamPoints: number,
    dealerIndex: number,
    trick: Card[],
    trump: Suit,
    winner: number,
    nextPlayer: number,
}

enum GameState {
    WaitingForPlayers,
    WaitingForTrump,
    InRound,
    TrickEnded,
    Ended
}

class _Game {

    private readonly _id: string = uuidv4(); 
    private _gameState: GameState = GameState.WaitingForPlayers;
    private _players: Player[] = [];
    private _firstTeamPoints: number = 0;
    private _secondTeamPoints: number = 0;
    private _firstTeamCards: Card[] = [];
    private _secondTeamCards: Card[] = [];
    private _dealerIndex: number = -1;
    private _cardsInThisTrick: Card[] = [];
    private _trump: Suit = Suit.Spades;
    private _trickWinner: number = 0;
    private _highestCard: Card = new Card(Rank.Ten, Suit.Spades);
    private _nextPlayer: number = 0;

    public get id(): string {
        return this._id;
    }

    public joinPlayer(username: string) {
        if (this._players.find(p => p.username === username)) {
            throw new Error("This player is already in the game");
        }
        const player: Player = new Player(username);
        this._players.push(player);
        if (this._players.length === amountOfPlayersInGame) this.startRound();
    }

    private startRound(): void {
        this._gameState = GameState.WaitingForTrump;
        this._dealerIndex = (this._dealerIndex + 1) % amountOfPlayersInGame;
        this.dealCards();
        this._trickWinner = this._dealerIndex;
        this._nextPlayer = (this._dealerIndex + 1) % amountOfPlayersInGame;
        this._cardsInThisTrick = [];
        this._firstTeamCards = [];
        this._secondTeamCards = [];
    }

    private dealCards(): void {
        const deck = [];
        for (const rank in Rank) {
            for (const suit in Suit) {
                deck.push(new Card(rank as Rank, suit as Suit));
            }
        }
        _Game.shuffle(deck);
        let index: number = 0;
        while (deck.length > 0) {
            this._players[index].addCardToHand(deck.pop()!);
            index = (index + 1) % amountOfPlayersInGame;
        }
    }

    private static shuffle(deck: Card[]): void {
        let i = deck.length, j;
        while (--i > 0) {
            j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    public chooseTrump(trump: Suit, playerId: string): void {
        if (this._gameState != GameState.WaitingForTrump) {
            throw new Error("Trump was already chosen for the round");
        }
        if (this._players[this._dealerIndex].id != playerId) {
            throw new Error("Only dealer is allowed to choose trump");
        }
        this._trump = trump;
        this._gameState = GameState.InRound;
    }
    
    public makeMove(index: number, playerId: string): void {
        const player = this._players[this._nextPlayer];
        if (player.id != playerId) {
            throw new Error("It's not your turn");
        }
        const card = player.getCardFromHand(index);
        this.placeCard(player, card);
        if (this._cardsInThisTrick.length === amountOfPlayersInGame) {
            this.endTrick();
        }
        this._nextPlayer = (this._nextPlayer + 1) % amountOfPlayersInGame;
    }

    private placeCard(player: Player, card: Card): void {
        if (!this.isAllowedToPlay(player, card)) throw new Error("You aren't allowed to play that card");
        this._cardsInThisTrick.push(card);
        if (this.cardIsHigher(card)) {
            this._trickWinner = this._nextPlayer;
            this._highestCard = card;
        }
    }

    private isAllowedToPlay(player: Player, card: Card): boolean {
        if (this._cardsInThisTrick.length === 0) return true;
        const suitForTrick = this._cardsInThisTrick[0].suit;
        if (suitForTrick !== card.suit) {
            if (player.hasCardOfSuit(suitForTrick)) return false;
            if (card.suit !== this._trump) {
                if (player.hasCardOfSuit(this._trump)) return false;
            }
        }
        return true;
    }

    private cardIsHigher(card: Card): boolean {
        if (this._cardsInThisTrick.length === 0) return true;
        if (card.suit != this._trump && card.suit != this._cardsInThisTrick[0].suit) {
            return false;
        }
        if (card.suit === this._highestCard.suit) {
            return card.number < this._highestCard.number;
        }
        return card.suit === this._trump;
    }

    private endTrick() {
        this._gameState = GameState.TrickEnded;
        const teamWinner = (this._trickWinner % 2) ? this._firstTeamCards : this._secondTeamCards;
        for (const card of this._cardsInThisTrick) {
            teamWinner.push(card);
        }
        if (this._players[0].getCardFromHand.length < 1) {
            this.endRound();
        }
    }

    private endRound() {
        const firstPoints = this._firstTeamCards.reduce((sum, cur) => sum + cur.value, 0);
        const secondPoints = this._secondTeamCards.reduce((sum, cur) => sum + cur.value, 0);
        if (firstPoints > secondPoints) this._firstTeamPoints += firstPoints - draw;
        if (firstPoints < secondPoints) this._secondTeamPoints += secondPoints - draw;
        if (firstPoints < amountOfPointsToWin || secondPoints < amountOfPointsToWin) this.startRound();
        else this._gameState = GameState.Ended;
    }

    public getInfoForPlayer(playerId: string): GameInfo {
        const player: Player = this._players.find(p => p.id === playerId)!;
        if (player === undefined) throw new Error("couldn't find player " + playerId);
        return {
            dealerIndex: this._dealerIndex,
            firstTeamPoints: this._firstTeamPoints,
            secondTeamPoints: this._secondTeamPoints,
            gameState: this._gameState.toString(),
            hand: player.getCardsInHand()!,
            indexOfPlayer: this._players.indexOf(player),
            nextPlayer: this._nextPlayer,
            players: this._players.map(p => p.username),
            trick: this._cardsInThisTrick,
            trump: this._trump,
            winner: this._trickWinner
        } as GameInfo;
    }
}