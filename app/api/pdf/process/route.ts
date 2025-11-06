import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { execFile } from 'child_process';
import { pdfInsert, pdfUpdate } from '@/app/lib/pdf';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

async function pdfLength(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdfDoc = await PDFDocument.load(uint8Array);
  return pdfDoc.getPageCount();
}

// placeholder until core is ready
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const name  = formData.get("name");
    const email = formData.get("email");
    const translated : boolean = formData.get("translate") === "true";
    if (!file || !(file instanceof File))
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    if (typeof name !== "string" || typeof email !== "string")
        return NextResponse.json({ error: "Failed to retrieve file name or user email" }, { status: 400 });

    const id = await pdfInsert(name, email, translated);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); 
    const pageLen = pdfLength(arrayBuffer);
    
    const pdfPath = path.join(process.cwd(), 'public', 'pdf');
    if (!fs.existsSync(pdfPath))
      fs.mkdirSync(pdfPath, { recursive: true });
    const folderPath = path.join(pdfPath, email);
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });
    const fileName = `${id}.pdf`;
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, buffer);
    const publicLink = `/pdf/${email}/${fileName}`;

    const imagesFolderPath = path.join(folderPath, id.toString());
    if (!fs.existsSync(imagesFolderPath))
      fs.mkdirSync(imagesFolderPath, { recursive: true });

    execFile('pdftocairo', ['-jpeg', '-jpegopt', 'quality=80', '-r', '144', filePath, path.join(imagesFolderPath, 'page')]);

    await pdfUpdate(publicLink, name, email, await pageLen, false, true, translated);

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 400 });
  }
}