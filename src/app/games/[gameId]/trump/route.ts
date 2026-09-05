import { NextRequest, NextResponse } from "next/server";
import { dependencies } from "@/main/dependencies.ts";
import { ChooseTrump } from "@/service/useCases/chooseTrump.ts";
import { getSuit } from "@/domain/Card.ts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;
  const body = await request.json();

  const authHeader = request.headers.get("authorization")!;
  const playerId = authHeader.split(" ")[1];
  
  const suit = body.suit;
  
  const chooseTrump = new ChooseTrump(dependencies["games"]);

  await chooseTrump.execute(gameId, playerId, getSuit(suit));
  
  return NextResponse.json({});
}
