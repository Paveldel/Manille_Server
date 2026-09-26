import { NextRequest } from "next/server";
import { CreateGame } from "@/service/useCases/createGame.ts";
import { dependencies } from "@/main/dependencies.ts";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
  
    const username = body.username;
  
    const createGame = new CreateGame(dependencies["games"]);
  
    const { gameId, playerId } = await createGame.execute(username);
  
    return new Response(JSON.stringify({ gameId, playerId }), {
      status: 201
    });
  } catch (error) {
    return new Response(error + "", { status: 400 });
  }
}
