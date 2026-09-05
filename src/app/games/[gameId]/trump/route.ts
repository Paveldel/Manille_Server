import { NextRequest, NextResponse } from "next/server";
import { dependencies } from "@/main/dependencies.ts";
import { ChooseTrump } from "@/service/useCases/chooseTrump.ts";
import { Suit } from "@/domain/Card.ts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;
  const body = await request.json();

  const playerId = body.playerId;
  const suit = body.suit;
  
  const chooseTrump = new ChooseTrump(dependencies["games"]);

  const gameDetails = await chooseTrump.execute(gameId, playerId, Suit[suit as keyof typeof Suit]);
  
  return NextResponse.json(gameDetails);
}
