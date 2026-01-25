import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { pdfUpdate } from '@/app/lib/pdf';
import { writeR2, urlR2 } from '@/app/lib/r2';
import { translate } from '@/app/lib/core';

export const runtime = 'nodejs';

async function pdfLength(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdfDoc = await PDFDocument.load(uint8Array);
  return pdfDoc.getPageCount();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    let file;
    const r2_key  = formData.get("r2_key");
    const id_str  = formData.get("id");
    const name    = formData.get("name ");
    const email   = formData.get("email");
    if (typeof r2_key !== "string" || typeof id_str !== "string" || typeof name !== "string" || typeof email !== "string")
        return NextResponse.json({ error: "incorrect data" }, { status: 400 });
    const id = Number(id_str);
    if (!isNaN(id))
        return NextResponse.json({ error: "Failed to retrieve pdf id" }, { status: 400 });

    const url : string = await urlR2(r2_key, 60);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); 
    const pageLen = pdfLength(arrayBuffer);
    
    const key = await writeR2(buffer, String(id), email, "application/pdf");

    await pdfUpdate(name, key, email, await pageLen, false, true, true);

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 400 });
  }
}