import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class PlayCard {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string, index: number): Promise<void> {
        let game: Game;
        try {
            game = await this._games.loadGame(gameId);
        } catch (_) {
            throw new Error("Couldn't find game with that Id");
        }

        game.makeMove(index, playerId);

        await this._games.saveGame(game);
    }
}

export { PlayCard }