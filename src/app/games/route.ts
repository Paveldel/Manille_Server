import { NextRequest } from "next/server";
import { CreateGame } from "@/service/useCases/createGame.ts";
import { dependencies } from "@/main/dependencies.ts";

export async function POST(
  request: NextRequest
) {
  const body = await request.json();

  const username = body.username;

  const createGame = new CreateGame(dependencies["games"]);

  const gameId = await createGame.execute(username);

  return new Response(JSON.stringify({ gameId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
