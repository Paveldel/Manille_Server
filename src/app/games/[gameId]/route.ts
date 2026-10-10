import { NextRequest, NextResponse } from "next/server";
import { GetGameDetails } from "@/service/useCases/getGameDetails.ts";
import { dependencies } from "@/main/dependencies.ts";
import { PlayCard } from "@/service/useCases/playCard.ts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    const { gameId } = await params;

    const authHeader = request.headers.get("authorization")!;
    const playerId = authHeader.split(" ")[1];
    
    const getDetails = new GetGameDetails(dependencies["games"]);
  
    const gameDetails = await getDetails.execute(gameId, playerId);
    
    return NextResponse.json(gameDetails);
  } catch (error) {
    return new Response(error + "", { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    const { gameId } = await params;
    const body = await request.json();

    const authHeader = request.headers.get("authorization")!;
    const playerId = authHeader.split(" ")[1];
  
    const card: number = body.card;
    
    const playCard = new PlayCard(dependencies["games"]);
  
    await playCard.execute(gameId, playerId, card);
    
    return NextResponse.json({});
  } catch (error) {
    return new Response(error + "", { status: 400 });
  }
}
