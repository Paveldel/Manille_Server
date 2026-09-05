import { Card } from "@/domain/Card.ts";
import { Game } from "@/domain/Game.ts";
import { Player } from "@/domain/Player.ts";
import { Games } from "../interfaces/persistence.ts";

class PlayCard {
    private readonly _games: Games;

    constructor(games: Games) {
        this._games = games;
    }

    public async execute(gameId: string, playerId: string, card: Card): Promise<void> {
        const game: Game = await this._games.loadGame(gameId);

        const player: Player | null = game.getPlayerById(playerId);

        if (!player) throw new Error("No player found with that Id");

        game.placeCard(player, card);

        await this._games.saveGame(game);
    }
}

export { PlayCard }