import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class JoinGame {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, username: string): Promise<string> {
        let game: Game;
        try {
            game = await this._games.loadGame(gameId);
        } catch (_) {
            throw new Error("Couldn't find game with that Id");
        }

        const playerId: string = game.joinPlayer(username);

        await this._games.saveGame(game);

        return playerId;
    }
}

export { JoinGame }