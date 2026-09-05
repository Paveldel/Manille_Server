import { Game, type GameInfo } from "../../domain/Game.ts";
import { Games } from "../interfaces/persistence.ts";

class GetGameDetails {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string): Promise<GameInfo> {
        const game: Game = await this._games.loadGame(gameId);

        return game.getInfoForPlayer(playerId);
    }
}

export { GetGameDetails }