import { NextRequest, NextResponse } from 'next/server';
import { pdfRename } from '@/app/lib/pdf';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id     = Number(formData.get("id"));
        const r2_key = formData.get("r2_key");
        const email  = formData.get("email");
        const name   = String(formData.get("name"));
        if (typeof r2_key !== "string" || typeof email !== "string" || !Number.isFinite(id)) {
            return NextResponse.json({ error: "incorrect data from page" }, { status: 400 });
        }
        await pdfRename(name, id);
        return NextResponse.json({ status: 200 });
    }
    catch {
        return NextResponse.json({ error: "server error" }, { status: 400 });
    }
}