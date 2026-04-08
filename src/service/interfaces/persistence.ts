import { Game } from "@/domain/Game.ts";

export interface Games {
    saveGame: (game: Game) => Promise<void>;
    loadGame: (id: string) => Promise<Game>;
}