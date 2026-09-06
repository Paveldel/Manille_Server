import { Game, type GameInfo } from "@/domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class GetGameDetails {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string): Promise<GameInfo> {
        let game: Game;
        try {
            game = await this._games.loadGame(gameId);
        } catch (_) {
            throw new Error("Couldn't find game with that Id");
        }

        return game.getInfoForPlayer(playerId.trim());
    }
}

export { GetGameDetails }