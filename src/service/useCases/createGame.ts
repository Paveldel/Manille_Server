import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class CreateGame {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(username: string): Promise<string> {
        const game: Game = new Game();

        const playerId: string = game.joinPlayer(username);

        await this._games.saveGame(game);

        return playerId;
    }
}

export { CreateGame }