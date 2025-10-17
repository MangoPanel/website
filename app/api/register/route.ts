import { NextRequest, NextResponse } from 'next/server';
import { pg } from '@/app/lib/data';
import bcrypt from 'bcrypt'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const rawEmail = String(form.get('email') ?? '').trim().toLowerCase();
    const password = String(form.get('password') ?? '');

    if (!rawEmail || !EMAIL_RE.test(rawEmail))
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

    if (!password)
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });

    const hash = await bcrypt.hash(password, 12);

    await pg.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [rawEmail, hash],
    );

    const url = new URL('/login', request.url);
    return NextResponse.redirect(url, { status: 302 });
  } 
  catch (err: any) {

    if (err?.code === '23505')
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });

    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}