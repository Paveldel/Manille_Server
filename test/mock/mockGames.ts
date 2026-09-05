import { Game } from '@/domain/Game.ts';
import { Games } from "@/service/interfaces/persistence.ts";

const games: Game[] = []

async function saveGame(game: Game) : Promise<void> {
    if (games.find(g => g.id === game.id)) {
        return;
    } else {
        games.push(game);
    }
}

async function loadGame(id: string) : Promise<Game> {
    return games.find(g => g.id === id)!;
}

const mockGames = {
    "saveGame": saveGame,
    "loadGame": loadGame
} as Games

export { mockGames }