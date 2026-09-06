import { NextResponse, NextRequest } from "next/server";
import { NextTrick } from "@/service/useCases/nextTrick.ts";
import { dependencies } from "@/main/dependencies.ts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  try {
    const { gameId } = await params;
  
    const nextTrick = new NextTrick(dependencies["games"]);
  
    await nextTrick.execute(gameId);
  
    return NextResponse.json({ });
  } catch (error) {
    return new Response(error + "", { status: 400 });
  }
}
