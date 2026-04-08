import { describe, it, expect } from "vitest";
import { Game, GameState } from "../../src/domain/Game.ts";
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

function setupGameWith4Players() {
    const game = new Game();

    game.joinPlayer("A");
    game.joinPlayer("B");
    game.joinPlayer("C");
    game.joinPlayer("D");

    return game;
}

describe("Game", () => {
    it("should allow players to join", () => {
        const game = new Game();

        game.joinPlayer("A");
        game.joinPlayer("B");

        const players = ["A", "B"];

        // get info from one of them
        const id = (game as any)._players[0].id;
        const info = game.getInfoForPlayer(id);

        expect(info.players).toEqual(players);
    });

    describe("joining players", () => {
        it("should not allow duplicate usernames", () => {
            const game = new Game();

            game.joinPlayer("A");

            expect(() => game.joinPlayer("A"))
                .toThrow();
        });

        it("should start round when 4 players joined", () => {
            const game = setupGameWith4Players();

            const info = game.getInfoForPlayer(
                game["_players"]?.[0]?.id ?? ""
            );

            expect(info.gameState).toBeDefined();
        });
    });

    describe("round start", () => {

        it("should deal 8 cards to each player", () => {
            const game = setupGameWith4Players();

            const players = [
                game.getInfoForPlayer(
                    game["_players"][0].id
                ),
                game.getInfoForPlayer(
                    game["_players"][1].id
                ),
                game.getInfoForPlayer(
                    game["_players"][2].id
                ),
                game.getInfoForPlayer(
                    game["_players"][3].id
                )
            ];

            for (const p of players) {
                expect(p.hand.length).toBe(8);
            }
        });

        it("should set game state to WaitingForTrump", () => {
            const game = setupGameWith4Players();
            const id = game["_players"][0].id;

            const info = game.getInfoForPlayer(id);

            expect(info.gameState).toEqual(GameState.WaitingForTrump);
        });

    });

    describe("chooseTrump", () => {

        it("only dealer can choose trump", () => {
            const game = setupGameWith4Players();

            const dealer = game["_players"][0];
            const notDealer = game["_players"][1];

            expect(() =>
                game.chooseTrump(Suit.Hearts, notDealer.id)
            ).toThrow();

            expect(() =>
                game.chooseTrump(Suit.Hearts, dealer.id)
            ).not.toThrow();
        });

        it("should switch state to InRound", () => {
            const game = setupGameWith4Players();
            const dealer = game["_players"][0];

            game.chooseTrump(Suit.Hearts, dealer.id);

            const info = game.getInfoForPlayer(dealer.id);

            expect(info.gameState).toEqual(GameState.InRound);
        });

    });

    describe("turn order", () => {

        it("should enforce correct player turn", () => {
            const game = setupGameWith4Players();
            const dealer = game["_players"][0];

            game.chooseTrump(Suit.Spades, dealer.id);

            const wrongPlayer = game["_players"][2];

            expect(() =>
                game.makeMove(0, wrongPlayer.id)
            ).toThrow();
        });

    });

    describe("follow suit rule", () => {

        it("must follow suit when possible", () => {
            const game = setupGameWith4Players();
            const dealer = game["_players"][0];

            game.chooseTrump(Suit.Spades, dealer.id);

            const first = game["_players"][1];
            const second = game["_players"][2];

            // first plays any card
            game.makeMove(0, first.id);

            const trickSuit =
                game.getInfoForPlayer(first.id).trick[0].suit;

            const secondHand =
                game.getInfoForPlayer(second.id).hand;

            const differentSuitIndex =
                secondHand.findIndex(
                    c => c.suit !== trickSuit
                );

            const sameSuitExists =
                secondHand.some(
                    c => c.suit === trickSuit
                );

            if (sameSuitExists && differentSuitIndex !== -1) {
                expect(() =>
                    game.makeMove(differentSuitIndex, second.id)
                ).toThrow();
            }
        });

    });

    describe("trick progression", () => {

        it("should accept 4 cards in a trick", () => {
            const game = setupGameWith4Players();
            const dealer = game["_players"][0];

            game.chooseTrump(Suit.Spades, dealer.id);

            const ids = game["_players"].map(p => p.id);

            playCardForPlayer(game, ids[1]);
            playCardForPlayer(game, ids[2]);
            playCardForPlayer(game, ids[3]);
            playCardForPlayer(game, ids[0]);
            

            const info = game.getInfoForPlayer(ids[0]);

            expect(info.trick.length).toBe(4);
        });

    });

    describe("getInfoForPlayer", () => {

        it("should return correct player index", () => {
            const game = setupGameWith4Players();

            const p = game["_players"][2];

            const info = game.getInfoForPlayer(p.id);

            expect(info.indexOfPlayer).toBe(2);
        });

        it("should return player hand", () => {
            const game = setupGameWith4Players();
            const p = game["_players"][1];

            const info = game.getInfoForPlayer(p.id);

            expect(info.hand.length).toBe(8);
        });

        it("should include trump", () => {
            const game = setupGameWith4Players();
            const dealer = game["_players"][0];

            game.chooseTrump(Suit.Diamonds, dealer.id);

            const info = game.getInfoForPlayer(dealer.id);

            expect(info.trump).toBe(Suit.Diamonds);
        });

    });

});