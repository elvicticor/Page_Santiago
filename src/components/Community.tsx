import { useEffect, useState } from 'react';

const BUCKET = 'fotos-gala';
const MAX_SIZE_MB = 8;

type Foto = {
    id: string;
    nombre: string | null;
    hashtag: string | null;
    url: string;
    created_at: string;
};

export default function Community() {
    const [fotos, setFotos] = useState<Foto[]>([]);
    const [loadingFotos, setLoadingFotos] = useState(true);
    const [status, setStatus] = useState<'idle' | 'unconfigured' | 'uploading' | 'sent' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const [nombre, setNombre] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const loadFotos = async () => {
        if (!supabaseUrl || !supabaseKey) {
            setStatus('unconfigured');
            setLoadingFotos(false);
            return;
        }
        try {
            const response = await fetch(
                `${supabaseUrl}/rest/v1/fotos?select=id,nombre,hashtag,url,created_at&aprobado=eq.true&order=created_at.desc&limit=24`,
                { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
            );
            if (!response.ok) throw new Error();
            setFotos(await response.json());
        } catch {
            // silencioso: la galería simplemente queda vacía si falla la consulta
        } finally {
            setLoadingFotos(false);
        }
    };

    useEffect(() => {
        loadFotos();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        if (!supabaseUrl || !supabaseKey) {
            setStatus('unconfigured');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setStatus('error');
            setErrorMsg('El archivo debe ser una imagen.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setStatus('error');
            setErrorMsg(`La imagen debe pesar menos de ${MAX_SIZE_MB}MB.`);
            return;
        }

        setStatus('uploading');
        setErrorMsg('');

        try {
            const path = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

            const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
                method: 'POST',
                headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': file.type },
                body: file,
            });
            if (!uploadResponse.ok) throw new Error('No se pudo subir la foto.');

            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;

            const insertResponse = await fetch(`${supabaseUrl}/rest/v1/fotos`, {
                method: 'POST',
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal',
                },
                body: JSON.stringify({ nombre: nombre || null, hashtag: hashtag || null, url: publicUrl }),
            });
            if (!insertResponse.ok) throw new Error('No se pudo guardar tu foto.');

            setStatus('sent');
            setNombre('');
            setHashtag('');
            setFile(null);
        } catch (caught) {
            setStatus('error');
            setErrorMsg(caught instanceof Error ? caught.message : 'Intenta de nuevo.');
        }
    };

    return (
        <section id="comunidad" className="container">
            <div className="section-header reveal">
                <h3>Fotos de la comunidad</h3>
                <span className="mono section-eyebrow">COMPARTE_TU_MOMENTO</span>
            </div>

            <div className="community-grid reveal">
                <form className="community-form" onSubmit={handleSubmit}>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
                        Sube tu foto de la gala y etiqueta el premio en Instagram con su
                        hashtag oficial. Cada foto se revisa antes de publicarse aquí.
                    </p>
                    <input type="text" placeholder="Tu nombre (opcional)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <input type="text" placeholder="#HashtagDelPremio (opcional)" value={hashtag} onChange={(e) => setHashtag(e.target.value)} />
                    <div className="file-upload">
                        <input
                            id="foto-file"
                            className="file-upload-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            required
                        />
                        <label htmlFor="foto-file" className="file-upload-label">
                            {file ? 'Cambiar foto' : 'Seleccionar foto'}
                        </label>
                        <span className="file-upload-name">
                            {file ? file.name : 'Ningún archivo seleccionado'}
                        </span>
                    </div>
                    <button type="submit" className="btn-submit" disabled={status === 'uploading'}>
                        {status === 'uploading' ? 'Subiendo...' : 'Enviar foto'}
                    </button>
                    {status === 'unconfigured' && (
                        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                            Esta sección se activará cuando se configure Supabase en <code>.env</code>.
                        </p>
                    )}
                    {status === 'sent' && (
                        <p style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>¡Gracias! Tu foto quedó en revisión y aparecerá pronto.</p>
                    )}
                    {status === 'error' && <p style={{ color: 'var(--wine)', fontSize: '0.85rem' }}>{errorMsg}</p>}
                </form>

                <div className="community-gallery">
                    {loadingFotos && <p className="mono" style={{ color: 'var(--muted)' }}>Cargando fotos...</p>}
                    {!loadingFotos && status !== 'unconfigured' && fotos.length === 0 && (
                        <p className="mono" style={{ color: 'var(--muted)' }}>Aún no hay fotos aprobadas. ¡Sé el primero en compartir!</p>
                    )}
                    <div className="social-feed-grid">
                        {fotos.map((foto) => (
                            <div className="feed-item" key={foto.id}>
                                <img src={foto.url} alt={foto.nombre ?? 'Foto de la comunidad'} />
                                {foto.hashtag && (
                                    <div className="feed-overlay">
                                        <span className="mono">{foto.hashtag}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
