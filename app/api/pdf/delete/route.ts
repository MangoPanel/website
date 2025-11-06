import { NextRequest, NextResponse } from 'next/server';
import { pdfDelete } from '@/app/lib/pdf';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const id    = Number(formData.get("id"));
    const email = formData.get("email");
    if (typeof email !== "string" || !Number.isFinite(id)) {
        return NextResponse.json({ error: "Failed to retrieve id or user email" }, { status: 400 });
    }
    await pdfDelete(email, id);
    return NextResponse.json({ status: 200 });
}