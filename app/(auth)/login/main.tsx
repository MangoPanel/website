'use client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

export function Main() {
    const [error, setError] = useState('')
    const { pending } = useFormStatus()
    const router = useRouter()

    async function Login(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault();
        setError('');

        const data = new FormData(form.currentTarget);
        const request = await fetch('/api/login', {
            method: 'POST',
            body: data,
        });
        if (request.redirected) 
            router.push('/main');
        else {
            const json = await request.json();
            setError(json.error || 'unknown error')
        }
    }

    return (
        <main>
            <div className="form-container">
                <form onSubmit={Login}>
                    <input type="text" name="email" placeholder="email" required />
                    <input type="password" name="password" placeholder="password" required />
                    <button disabled={pending} type="submit">Sign in</button>

                </form>
            </div>
            {error &&
                <div className="error-box">
                    <p>{error}</p>
                </div>
            }
        </main>
    );
}