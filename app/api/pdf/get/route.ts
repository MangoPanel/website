import { NextRequest, NextResponse } from 'next/server';
import { pdfGet } from '@/app/lib/pdf'

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const email = data.email;
        const name  = data.name;
        if (!email || !name)
            return NextResponse.json({ error: "failed to recieve data" }, { status: 500 });
        return NextResponse.json({ pdf : await pdfGet(name, email) });
    } catch {
         return NextResponse.json({ error: "server error" }, { status: 400 });
    }
}