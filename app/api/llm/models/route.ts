import { NextResponse } from "next/server";
import { listAvailableLlmModels } from "@/server/llm/resolveMongoOperationWithLlm";

export const runtime = "nodejs";

export async function GET() {
  const result = await listAvailableLlmModels();

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        models: result.models,
        currentModel: result.currentModel,
        errors: result.error ? [result.error] : ["No se pudieron cargar los modelos locales."]
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      models: result.models,
      currentModel: result.currentModel
    },
    { status: 200 }
  );
}
