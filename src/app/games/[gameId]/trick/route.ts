import { NextResponse } from "next/server";
import { NextTrick } from "@/service/useCases/nextTrick.ts";
import { dependencies } from "@/main/dependencies.ts";

export async function POST(
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;  

  const nextTrick = new NextTrick(dependencies["games"]);

  await nextTrick.execute(gameId);

  return NextResponse.json({ });
}
