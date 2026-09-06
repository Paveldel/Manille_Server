import fs from 'node:fs/promises';
import { Game } from '@/domain/Game.ts';
import { Games } from "@/service/interfaces/persistence.ts";
import { Player } from '@/domain/Player.ts';
import { Card, getSuit, getRank } from '@/domain/Card.ts';

async function saveGame(game: Game) : Promise<void> {
    await fs.mkdir('storage/games/', { recursive: true });
    await fs.writeFile('storage/games/' + game.id, JSON.stringify(game));
}

function jsonToCard(json: { [key: string]: string; }) {
    const rank = getRank(json["_rank"]);
    const suit = getSuit(json["_suit"]);

    return new Card(rank, suit);
}

async function loadGame(id: string) : Promise<Game> {
    const data: string = await fs.readFile('storage/games/' + id, 'utf8');
    let json = JSON.parse(data);
    json["_players"] = json["_players"].map(p => {
        let player: any = { ...p };
        player["_hand"] = (player["_hand"] as unknown as { [key: string]: string; }[]).map(jsonToCard);
        return Object.assign(new Player(""), p)
    });
    json["_cardsInThisTrick"] = (json["_cardsInThisTrick"] as unknown as { [key: string]: string; }[]).map(jsonToCard);
    json["_secondTeamCards"] = (json["_secondTeamCards"] as unknown as { [key: string]: string; }[]).map(jsonToCard);
    json["_firstTeamCards"] = (json["_firstTeamCards"] as unknown as { [key: string]: string; }[]).map(jsonToCard);
    json["_highestCard"] = jsonToCard(json["_highestCard"] as any);
    json["_trump"] = getSuit(json["_trump"]);
    const game = Object.assign(new Game, json);
    return game;
}

const jsonStore = {
    "saveGame": saveGame,
    "loadGame": loadGame
} as Games

export { jsonStore }