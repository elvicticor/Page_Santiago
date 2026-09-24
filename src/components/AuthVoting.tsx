import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import VotingForm from './VotingForm';
import ResultsChart from './ResultsChart';

type Mode = 'login' | 'register';

function AuthForm() {
    const [mode, setMode] = useState<Mode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setMessage('');

        if (!isSupabaseConfigured) {
            setMessage('Supabase no está configurado. Revisa el archivo .env.');
            setBusy(false);
            return;
        }

        if (mode === 'register') {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: name.trim() },
                    emailRedirectTo: window.location.href,
                },
            });
            if (error) setMessage(error.message);
            else if (!data.session) setMessage('Cuenta creada. Revisa tu correo y confirma el enlace antes de iniciar sesión.');
            else setMessage('Cuenta creada correctamente.');
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setMessage(error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos.' : error.message);
        }
        setBusy(false);
    };

    return <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-copy">
            <span className="mono section-eyebrow">Acceso de votantes</span>
            <h2 id="auth-title">{mode === 'login' ? 'Inicia sesión para votar' : 'Crea tu cuenta'}</h2>
            <p>Tu cuenta permite registrar una sola votación y protege la integridad de los resultados.</p>
        </div>
        <div className="auth-tabs" role="tablist" aria-label="Acceso">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage(''); }}>Iniciar sesión</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage(''); }}>Registrarme</button>
        </div>
        <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && <label>Nombre completo<input type="text" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} autoComplete="name" required /></label>}
            <label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
            <button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Procesando…' : mode === 'login' ? 'Entrar y votar' : 'Crear cuenta'}</button>
            {message && <p className="auth-message" role="status">{message}</p>}
        </form>
    </section>;
}

export default function AuthVoting() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setLoading(false); });
        return () => data.subscription.unsubscribe();
    }, []);

    if (loading) return <p className="auth-loading">Comprobando sesión…</p>;

    return <>
        {session ? <>
            <div className="voter-session">
                <div><span className="mono section-eyebrow">Sesión activa</span><strong>{session.user.user_metadata.display_name || session.user.email}</strong></div>
                <button type="button" className="btn btn-outline" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
            </div>
            <VotingForm userId={session.user.id} />
        </> : <AuthForm />}
        <ResultsChart />
    </>;
}
