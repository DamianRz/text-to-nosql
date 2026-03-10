import { NextResponse } from "next/server";
import { executeMongoOperation } from "@/server/mongo/executeMongoOperation";
import { getMongoDb } from "@/server/mongo/client";
import type { MongoOperation } from "@/types/mongo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { operation?: MongoOperation };

    if (!body?.operation) {
      return NextResponse.json({ ok: false, errors: ["Se requiere 'operation'."] }, { status: 400 });
    }

    const db = await getMongoDb();
    const result = await executeMongoOperation(db, body.operation);

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al ejecutar consulta en MongoDB.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 500 });
  }
}
