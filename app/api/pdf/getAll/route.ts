import { NextRequest, NextResponse } from 'next/server';
import { pdfGetAll } from '@/app/lib/pdf'

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const { email } = (await request.json()) as { email?: string };
        if (!email)
            return NextResponse.json({ error: "failed to recieve user email" }, { status: 500 });
        return NextResponse.json({ pdfArr : await pdfGetAll(email) });
    } catch {
        return NextResponse.json({ error: "server error" }, { status: 400 });
    }
    
}