import { describe, it, expect } from "vitest";
import { Game, GameState } from "../../src/domain/Game.ts";
import { Player } from "../../src/domain/Player.ts";
import { Suit } from "../../src/domain/Card.ts";

const playCardForPlayer = (game: Game, id: string) => {
    for (let i = 0; i < 8; i++) {
        try {
            game.makeMove(i, id);
            return;
        } catch (_) {
            continue;
        }
    }
    throw Error("Player could not play any cards");
}

function setup(): { game: Game, players: Player[] } {
    const game = new Game();

    game.joinPlayer("A");
    game.joinPlayer("B");
    game.joinPlayer("C");
    game.joinPlayer("D");

    const players = (game as any)._players;

    game.chooseTrump(Suit.Spades, players[0].id);

    return { game, players };
}

describe("Game critical rule tests", () => {

    it("should remove card from hand after playing", () => {
        const { game, players } = setup();

        const player = players[1];

        const before = game.getInfoForPlayer(player.id).hand.length;

        game.makeMove(0, player.id);

        const after = game.getInfoForPlayer(player.id).hand.length;

        expect(after).toBe(before - 1);
    });

    it("should not allow playing same card twice", () => {
        const { game, players } = setup();

        const player = players[1];

        game.makeMove(0, player.id);

        expect(() =>
            game.makeMove(0, player.id)
        ).toThrow();
    });

    it("trick winner should start next trick", () => {
        const { game, players } = setup();

        const ids = players.map(p => p.id);

        playCardForPlayer(game, ids[1]);
        playCardForPlayer(game, ids[2]);
        playCardForPlayer(game, ids[3]);
        playCardForPlayer(game, ids[0]);

        const info = game.getInfoForPlayer(ids[0]);

        expect(info.nextPlayer).toBe(info.winner);
    });

    it("round should end after all cards are played", () => {
        const { game, players } = setup();

        const ids = players.map(p => p.id);

        let info = game.getInfoForPlayer(ids[0]);

        // play all 8 tricks
        for (let i = 0; i < 8; i++) {
            playCardForPlayer(game, ids[(info.nextPlayer) % 4]);
            playCardForPlayer(game, ids[(info.nextPlayer + 1) % 4]);
            playCardForPlayer(game, ids[(info.nextPlayer + 2) % 4]);
            playCardForPlayer(game, ids[(info.nextPlayer + 3) % 4]);
            info = game.getInfoForPlayer(ids[0]);
            if (i !== 7) game.nextTrick();
        }

        expect(info.gameState).toEqual(GameState.WaitingForTrump);
    });

    it("must play trump when unable to follow suit", () => {
        const { game, players } = setup();

        const first = players[1];
        const second = players[2];

        game.makeMove(0, first.id);

        const info = game.getInfoForPlayer(first.id);
        const suit = info.trick[0].suit;

        const secondHand = game.getInfoForPlayer(second.id).hand;

        const offSuitIndex = secondHand.findIndex(
            c => c.suit !== suit && c.suit !== Suit.Spades
        );

        const hasTrump = secondHand.some(
            c => c.suit === Suit.Spades
        );

        const hasSuit = secondHand.some(
            c => c.suit === suit
        );

        if (!hasSuit && hasTrump && offSuitIndex !== -1) {
            expect(() =>
                game.makeMove(offSuitIndex, second.id)
            ).toThrow();
        }
    });

    it("should allow trump when player cannot follow suit", () => {
        const { game, players } = setup();

        const first = players[1];
        const second = players[2];

        game.makeMove(0, first.id);

        const suit = game
            .getInfoForPlayer(first.id)
            .trick[0].suit;

        const secondHand =
            game.getInfoForPlayer(second.id).hand;

        const trumpIndex = secondHand.findIndex(
            c => c.suit === Suit.Spades
        );

        const hasSuit = secondHand.some(
            c => c.suit === suit
        );

        if (!hasSuit && trumpIndex !== -1) {
            expect(() =>
                game.makeMove(trumpIndex, second.id)
            ).not.toThrow();
        }
    });

});