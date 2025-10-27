import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { pg } from '@/app/lib/data';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

async function pdfLength(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdfDoc = await PDFDocument.load(uint8Array);
  return pdfDoc.getPageCount();
}

async function pdfInsert(link: String, name: String, email: String, pageCount: number, bool: Boolean) {
    await pg.query(
        'INSERT INTO pdf_files (link, name, user_email, page_count, favourite) values ($1, $2, $3, $4, $5)',
        [link, name, email, pageCount, bool],
    );
}

// placeholder until core is ready
export async function POST(request: NextRequest) {
    const form  = await request.formData();
    const email = String(form.get('email'));
    const name  = String(form.get('name'));
    const pdf   = form.get('PDF');

    if (!(pdf instanceof File)) 
        return NextResponse.json({ error: "PDF must be a file" }, { status: 400 });
    if (pdf.type !== "application/pdf") 
        return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });

    const arrayBuffer = await pdf.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); 
    const pageLen = await pdfLength(arrayBuffer);
    const fileName = `${name}-${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), "public", "pdf", email, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    const publicLink = `/pdf/${email}/${fileName}`;

    pdfInsert(publicLink, name, email, pageLen, false);
}