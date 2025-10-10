'use client'
import { useFormStatus } from "react-dom";
import { redirect } from 'next/navigation';

export default function Home() {
    return (
        <main>
            <div className="form-container">
                <RegisterForm />
            </div>
        </main>
    );
}

// form action
function foo(formData: FormData) {
    redirect('/main');
}

function RegisterForm() {
    return (
        <form action={foo}>
            <input type="text" name="email" required />
            <input type="password" name="password" required />
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} type="submit">Sign in</button>
    );
}