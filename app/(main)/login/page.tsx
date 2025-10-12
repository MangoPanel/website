'use client'
import { useFormStatus } from "react-dom";
import { redirect } from 'next/navigation';

export default function Home() {
    return (
        <main>
            <div className="form-container">
                <LoginForm />
            </div>
        </main>
    );
}

// form action
function foo(formData: FormData) {
    redirect('/main');
}

function LoginForm() {
    const { pending } = useFormStatus();
    return (
        <form action={foo}>
            <input type="text" name="email" placeholder="email" required />
            <input type="password" name="password" placeholder="password" required />
            <button disabled={pending} type="submit">Sign in</button>
        </form>
    );
}