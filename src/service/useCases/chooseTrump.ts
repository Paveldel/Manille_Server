import { Suit } from "@/domain/Card.ts";
import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class ChooseTrump {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string, trump: Suit): Promise<void> {
        const game: Game = await this._games.loadGame(gameId);

        game.chooseTrump(trump, playerId);

        await this._games.saveGame(game);
    }
}

export { ChooseTrump }