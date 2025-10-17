import { NextRequest, NextResponse } from 'next/server';
import { pg } from '@/app/lib/data';
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const rawEmail = String(form.get('email') ?? '').trim().toLowerCase();
        const password = String(form.get('password') ?? '');
        if (!rawEmail || !password)
            return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
        const result = await pg.query('SELECT email, password from users WHERE email = $1', [rawEmail]);
        if (result.rows.length === 0)
            return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
        const user  = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) 
            return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
        
        const response = NextResponse.redirect(new URL('/main', request.url), { status: 302 });
        response.cookies.set('user_email', user.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });
        return response;
    }   
    catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}