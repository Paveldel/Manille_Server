import { Suit } from "@/domain/Card.ts";
import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class ChooseTrump {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string, trump: Suit): Promise<void> {
        let game: Game;
        try {
            game = await this._games.loadGame(gameId);
        } catch (_) {
            throw new Error("Couldn't find game with that Id");
        }

        game.chooseTrump(trump, playerId);

        await this._games.saveGame(game);
    }
}

export { ChooseTrump }