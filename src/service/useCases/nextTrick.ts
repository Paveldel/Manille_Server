import { Game } from "../../domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class JoinGame {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string): Promise<void> {
        const game: Game = await this._games.loadGame(gameId);

        game.nextTrick();

        await this._games.saveGame(game);
    }
}

export { JoinGame }