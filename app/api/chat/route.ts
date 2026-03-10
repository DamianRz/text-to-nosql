import { NextResponse } from "next/server";
import { createChatResponseWithResolver } from "@/server/chat/createChatResponseWithResolver";
import type { ChatResolverMode } from "@/types/mongo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; llmMode?: ChatResolverMode; llmModel?: string };
  const text = body?.text?.trim();
  const llmMode = body?.llmMode ?? "off";
  const llmModel = body?.llmModel?.trim();

  if (!text) {
    return NextResponse.json({ ok: false, errors: ["Se requiere 'text'."] }, { status: 400 });
  }

  if (llmMode !== "off" && llmMode !== "fallback" && llmMode !== "force") {
    return NextResponse.json({ ok: false, errors: ["'llmMode' debe ser off, fallback o force."] }, { status: 400 });
  }

  const response = await createChatResponseWithResolver(text, { llmMode, llmModel });
  return NextResponse.json(response, { status: response.ok ? 200 : 400 });
}
