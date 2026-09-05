import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

interface result {
    playerId: string,
    gameId: string
}

class CreateGame {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(username: string): Promise<result> {
        const game: Game = new Game();

        const playerId: string = game.joinPlayer(username);

        await this._games.saveGame(game);

        return { playerId, gameId: game.id};
    }
}

export { CreateGame }