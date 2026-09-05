import fs from 'node:fs/promises';
import { Game } from '@/domain/Game.ts';
import { Games } from "@/service/interfaces/persistence.ts";

async function saveGame(game: Game) : Promise<void> {
    fs.mkdir('storage/games/', { recursive: true });
    await fs.writeFile('storage/games/' + game.id, JSON.stringify(game));
}

async function loadGame(id: string) : Promise<Game> {
    const data: string = await fs.readFile('storage/games/' + id, 'utf8');
    return JSON.parse(data) as Game;
}

const jsonStore = {
    "saveGame": saveGame,
    "loadGame": loadGame
} as Games

export { jsonStore }