import { Game } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class NextTrick {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string): Promise<void> {
        let game: Game;
        try {
            game = await this._games.loadGame(gameId);
        } catch (_) {
            throw new Error("Couldn't find game with that Id");
        }

        game.nextTrick();

        await this._games.saveGame(game);
    }
}

export { NextTrick }