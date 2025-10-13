import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");

    if (!folder) {
      return NextResponse.json({ error: "Missing folder parameter" }, { status: 400 });
    }

    const cacheBase = path.join(process.cwd(), "public/cache");
    const target = path.join(cacheBase, folder);

    if (!target.startsWith(cacheBase)) {
      return NextResponse.json({ error: "Invalid folder path" }, { status: 400 });
    }

    await fs.rm(target, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cleanup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}