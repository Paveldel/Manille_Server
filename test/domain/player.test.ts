import { describe, it, expect, beforeEach } from "vitest";
import { Player } from "../../src/domain/Player.ts";
import { Card, Suit, Rank } from "../../src/domain/Card.ts";

describe("Player", () => {
    let player: Player;

    const spadeAce = new Card(Rank.Ace, Suit.Spades);
    const heartKing = new Card(Rank.King, Suit.Hearts);
    const clubQueen = new Card(Rank.Queen, Suit.Clubs);

    beforeEach(() => {
        player = new Player("Alice");
    });

    describe("constructor", () => {
        it("should set username", () => {
            expect(player.username).toBe("Alice");
        });

        it("should generate an id", () => {
            expect(player.id).toBeDefined();
            expect(typeof player.id).toBe("string");
            expect(player.id.length).toBeGreaterThan(0);
        });

        it("should start with empty hand", () => {
            expect(player.getCardsInHand()).toEqual([]);
        });
    });

    describe("id", () => {
        it("should remain constant", () => {
            const first = player.id;
            const second = player.id;

            expect(first).toBe(second);
        });
    });

    describe("addCardToHand", () => {
        it("should add a card", () => {
            player.addCardToHand(spadeAce);

            expect(player.getCardsInHand()).toHaveLength(1);
            expect(player.getCardsInHand()[0]).toBe(spadeAce);
        });

        it("should add multiple cards in order", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);

            expect(player.getCardsInHand()).toEqual([spadeAce, heartKing]);
        });
    });

    describe("getCardFromHand", () => {
        it("should return card at index", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);

            expect(player.getCardFromHand(0)).toBe(spadeAce);
            expect(player.getCardFromHand(1)).toBe(heartKing);
        });
    });

    describe("removeFromHand", () => {
        it("should remove a card", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);

            player.removeFromHand(spadeAce);

            expect(player.getCardsInHand()).toEqual([heartKing]);
        });

        it("should remove only the specified card", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);
            player.addCardToHand(clubQueen);

            player.removeFromHand(heartKing);

            expect(player.getCardsInHand()).toEqual([spadeAce, clubQueen]);
        });

        it("should do nothing if card not in hand", () => {
            player.addCardToHand(spadeAce);

            player.removeFromHand(heartKing);

            expect(player.getCardsInHand()).toEqual([spadeAce]);
        });
    });

    describe("getCardsInHand", () => {
        it("should return all cards in hand", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);

            const cards = player.getCardsInHand();

            expect(cards).toEqual([spadeAce, heartKing]);
        });

        it("should not expose internal array reference", () => {
            player.addCardToHand(spadeAce);

            const cards = player.getCardsInHand();
            cards.push(heartKing);

            expect(player.getCardsInHand()).toEqual([spadeAce]);
        });
    });

    describe("hasCardOfSuit", () => {
        it("should return false for empty hand", () => {
            expect(player.hasCardOfSuit(Suit.Spades)).toBe(false);
        });

        it("should return true when player has suit", () => {
            player.addCardToHand(spadeAce);

            expect(player.hasCardOfSuit(Suit.Spades)).toBe(true);
        });

        it("should return false when suit not present", () => {
            player.addCardToHand(spadeAce);

            expect(player.hasCardOfSuit(Suit.Hearts)).toBe(false);
        });

        it("should detect suit among multiple cards", () => {
            player.addCardToHand(spadeAce);
            player.addCardToHand(heartKing);

            expect(player.hasCardOfSuit(Suit.Hearts)).toBe(true);
        });
    });
});