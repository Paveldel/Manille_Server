import { Game } from "../../domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class JoinGame {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, username: string): Promise<string> {
        const game: Game = await this._games.loadGame(gameId);

        const playerId: string = game.joinPlayer(username);

        await this._games.saveGame(game);

        return playerId;
    }
}

export { JoinGame }