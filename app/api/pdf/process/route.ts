import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { pdfInsert, pdfUpdate } from '@/app/lib/pdf';
import { writeR2 } from '@/app/lib/r2';
import { translate } from '@/app/lib/core';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
};
export const runtime = 'nodejs';

async function pdfLength(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdfDoc = await PDFDocument.load(uint8Array);
  return pdfDoc.getPageCount();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error(`Translator error no FILE`);
    }
    const name  = formData.get("name");
    const email = formData.get("email");
    const translated : boolean = formData.get("translate") === "true";
    if (!file || !(file instanceof File))
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (typeof name !== "string" || typeof email !== "string")
        return NextResponse.json({ error: "Failed to retrieve file name or user email" }, { status: 400 });

    const id : number = await pdfInsert(name, email, translated);
    let arrayBuffer : ArrayBuffer = await file.arrayBuffer();

    if (translated)
      arrayBuffer = await translate(arrayBuffer, name);

    const buffer = Buffer.from(arrayBuffer); 
    const pageLen = await pdfLength(arrayBuffer);
    
    const key = await writeR2(buffer, String(id), email, "application/pdf");

    await pdfUpdate(id, key, email, pageLen, false, true, translated);

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 400 });
  }
}