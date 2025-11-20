import { NextRequest, NextResponse } from 'next/server';
import { pdfDelete } from '@/app/lib/pdf';
import { deleteR2 } from '@/app/lib/r2';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id     = Number(formData.get("id"));
        const r2_key = formData.get("r2_key");
        const email  = formData.get("email");
        if (typeof r2_key !== "string" || typeof email !== "string" || !Number.isFinite(id)) {
            return NextResponse.json({ error: "incorrect data from page" }, { status: 400 });
        }
        await pdfDelete(email, id);
        await deleteR2(r2_key);
        return NextResponse.json({ status: 200 });
    }
    catch {
        return NextResponse.json({ error: "server error" }, { status: 400 });
    }
}