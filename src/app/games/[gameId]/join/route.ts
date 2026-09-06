import { JoinGame } from "@/service/useCases/joinGame.ts";
import { dependencies } from "@/main/dependencies.ts";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
    try {
        const { gameId } = await params;
        const body = await request.json();
    
        const username = body.username;
    
        const joinGame = new JoinGame(dependencies["games"]);
    
        const playerId = await joinGame.execute(gameId, username);
    
        return new Response(JSON.stringify({ playerId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(error + "", { status: 400 });
    }
}