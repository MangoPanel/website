import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { url } = (await req.json()) as { url?: string };
        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'could not find PDF file' }, { status: 400 });
        }
        const pdfPath = path.join(process.cwd(), 'public', decodeURIComponent(url.replace(/^\//, '')));
        await fs.access(pdfPath).catch(() => { throw new Error('PDF not found at ${pdfPath}') });
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf2jpg-'));
        const outPrefix = path.join(tmpDir, 'page');
        await execFileAsync('pdftocairo', ['-jpeg', '-jpegopt', 'quality=75', '-r', '144', pdfPath, outPrefix]);
        const files = await fs.readdir(tmpDir);
        const jpgs = files
            .filter((f) => f.toLocaleLowerCase().endsWith('.jpg'))
            .sort((a, b) => {
                const na = Number((a.match(/(\d+)\.jpg$/) || [,'0'])[1]);
                const nb = Number((b.match(/(\d+)\.jpg$/) || [,'0'])[1]);
                return na - nb;
        });
        if (jpgs.length === 0) { throw new Error('No images were produced by pdftocario'); }
        const buffers = await Promise.all(jpgs.map((fname) => fs.readFile(path.join(tmpDir, fname))));
        const images = buffers.map( (buf) => `data:image/jpg;base64,${buf.toString('base64')}` );
        
        try {
            await Promise.all(jpgs.map((fname) => fs.unlink(path.join(tmpDir, fname))));
            await fs.rmdir(tmpDir).catch(async () => {
                const rest = await fs.readdir(tmpDir);
                await Promise.all(rest.map((f) => fs.unlink(path.join(tmpDir, f))));
                await fs.rmdir(tmpDir);
            });
        } catch { /* ignore errors */ }

        return NextResponse.json({ images, pageCount: images.length });
    } catch (err: any) {
        const msg = err?.message || 'could not display PDF file';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}