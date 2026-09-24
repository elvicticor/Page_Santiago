import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type Category = { name: string; description: string; nominees: string[] };

export const categories: Category[] = [
    { name: 'Artista del año', description: 'La voz que marcó esta temporada.', nominees: ['Samuel García', 'Valentina Ríos', 'Daniel Calveti', 'Sara Moreno', 'Andrés Cepeda Worship', 'Lucía Fernández', 'Mateo Cruz', 'Camila Torres', 'David Salazar', 'Rebeca López'] },
    { name: 'Canción del año', description: 'La canción que más inspiró a nuestra comunidad.', nominees: ['Gracia Infinita', 'Vuelvo a Ti', 'Luz en el Camino', 'Tu Fidelidad', 'Cielo Abierto', 'Eres Mi Hogar', 'Nada Me Faltará', 'En Tu Presencia', 'Milagro de Amor', 'Todo Es Posible'] },
    { name: 'Álbum del año', description: 'La producción musical más destacada.', nominees: ['Renacer', 'Casa de Adoración', 'Más Cerca', 'Eterno', 'Raíces', 'Sin Límites', 'Voces del Reino', 'Paz en la Tormenta', 'Altar', 'Todo Nuevo'] },
    { name: 'Artista revelación', description: 'El nuevo talento que sorprendió este año.', nominees: ['Elías Romero', 'Mariana Vélez', 'Santiago León', 'Isa Beltrán', 'Josué Díaz', 'Mía Castillo', 'Nicolás Pardo', 'Emma Vargas', 'Felipe Suárez', 'Ana Sofía Gil'] },
    { name: 'Mejor artista femenina', description: 'Reconoce una trayectoria y desempeño sobresalientes.', nominees: ['Valentina Ríos', 'Sara Moreno', 'Lucía Fernández', 'Camila Torres', 'Rebeca López', 'Mariana Vélez', 'Isa Beltrán', 'Mía Castillo', 'Emma Vargas', 'Ana Sofía Gil'] },
    { name: 'Mejor artista masculino', description: 'Reconoce una trayectoria y desempeño sobresalientes.', nominees: ['Samuel García', 'Daniel Calveti', 'Mateo Cruz', 'David Salazar', 'Elías Romero', 'Santiago León', 'Josué Díaz', 'Nicolás Pardo', 'Felipe Suárez', 'Pablo Reyes'] },
    { name: 'Mejor banda o grupo', description: 'La agrupación que llevó su mensaje más lejos.', nominees: ['Voces del Reino', 'Conexión Cielo', 'Adoración Central', 'Ruta 7', 'Gracia Viva', 'Nación Santa', 'Fuego & Luz', 'Casa Worship', 'Aliento', 'Generación Uno'] },
    { name: 'Mejor canción de adoración', description: 'Una canción para acercarnos a Su presencia.', nominees: ['En Tu Presencia', 'Santo Por Siempre', 'Aquí Estoy', 'Mi Refugio', 'Digno', 'A Tus Pies', 'Altar', 'Te Contemplo', 'Gloria Eterna', 'Cerca de Ti'] },
    { name: 'Mejor canción urbana', description: 'Fe, ritmo y cultura urbana.', nominees: ['Sin Miedo', 'Código de Gracia', 'Otra Vida', 'Libre Soy', 'Flow del Reino', 'En la Calle', 'Mi Identidad', 'Luz Neón', 'Firmes', 'Voy Contigo'] },
    { name: 'Mejor canción pop', description: 'La propuesta pop cristiana favorita del público.', nominees: ['Vuelvo a Ti', 'Todo Es Posible', 'Eres Mi Hogar', 'Brillar', 'Amanecer', 'Contigo', 'Latidos', 'Por Siempre', 'Tu Voz', 'Un Día Más'] },
    { name: 'Mejor canción tropical', description: 'Celebración, esperanza y sabor latino.', nominees: ['Fiesta en el Cielo', 'Gozo', 'Baila Mi Alma', 'Celebraré', 'Ritmo de Fe', 'Alegría', 'Vivo Para Ti', 'Día de Victoria', 'Canto Libre', 'Suena la Esperanza'] },
    { name: 'Mejor colaboración', description: 'Dos o más talentos unidos por una canción.', nominees: ['Juntos Otra Vez', 'Somos Uno', 'Cielo Abierto', 'Tu Amor Nos Une', 'Un Mismo Corazón', 'Más Allá', 'Voces de Esperanza', 'Contigo Voy', 'La Promesa', 'Reino y Poder'] },
    { name: 'Mejor video musical', description: 'La propuesta audiovisual más memorable.', nominees: ['Luz en el Camino', 'Renacer', 'Sin Miedo', 'Cielo Abierto', 'Altar', 'Brillar', 'Mi Refugio', 'Somos Uno', 'Raíces', 'Amanecer'] },
    { name: 'Mejor producción musical', description: 'Excelencia creativa y técnica en el estudio.', nominees: ['Renacer — Samuel García', 'Eterno — Sara Moreno', 'Casa de Adoración — Voces del Reino', 'Más Cerca — Valentina Ríos', 'Raíces — David Salazar', 'Sin Límites — Conexión Cielo', 'Altar — Lucía Fernández', 'Todo Nuevo — Mateo Cruz', 'Paz en la Tormenta — Camila Torres', 'Gracia Viva — Gracia Viva'] },
    { name: 'Mejor productor', description: 'La mente detrás del sonido del año.', nominees: ['Alejandro Mesa', 'Juan Pablo Ríos', 'Marcos Téllez', 'Laura Jiménez', 'Esteban Duarte', 'Felipe Acosta', 'Daniel Mora', 'Sofía Cárdenas', 'Miguel Ángel Ruiz', 'Carlos Beltrán'] },
    { name: 'Mejor compositor', description: 'Historias y verdades convertidas en canciones.', nominees: ['Sara Moreno', 'Samuel García', 'Valentina Ríos', 'David Salazar', 'Lucía Fernández', 'Mateo Cruz', 'Mariana Vélez', 'Josué Díaz', 'Camila Torres', 'Santiago León'] },
    { name: 'Mejor álbum en vivo', description: 'La experiencia de adoración en directo más poderosa.', nominees: ['Noche de Gloria', 'En Casa: En Vivo', 'Cielo Abierto Live', 'Voces Unidas', 'Altar Vivo', 'Encuentro', 'Más Cerca Live', 'Un Solo Corazón', 'Santo: La Noche', 'Bogotá Adora'] },
    { name: 'Mejor podcast cristiano', description: 'Conversaciones que edifican e inspiran.', nominees: ['Café con Propósito', 'Fe Cotidiana', 'Más Profundo', 'Conversaciones de Gracia', 'La Mesa', 'Preguntas del Alma', 'Vivir con Propósito', 'Entre Amigos', 'Pausa y Fe', 'Historias de Esperanza'] },
    { name: 'Libro cristiano del año', description: 'El libro que dejó huella en sus lectores.', nominees: ['Fe para Hoy', 'El Camino de Regreso', 'Gracia Cotidiana', 'Una Vida con Propósito', 'Después de la Tormenta', 'Cartas al Corazón', 'Raíces de Esperanza', 'Silencio y Presencia', 'El Arte de Perdonar', 'Liderar Sirviendo'] },
    { name: 'Premio del público', description: 'El favorito absoluto de la comunidad PMA.', nominees: ['Samuel García', 'Valentina Ríos', 'Voces del Reino', 'Sara Moreno', 'Conexión Cielo', 'David Salazar', 'Lucía Fernández', 'Mateo Cruz', 'Camila Torres', 'Gracia Viva'] },
];

export default function VotingForm({ userId }: { userId: string }) {
    const [step, setStep] = useState(0);
    const [votes, setVotes] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [checkingVote, setCheckingVote] = useState(true);
    const category = categories[step];
    const answered = Object.keys(votes).length;
    const summary = useMemo(() => categories.map((item, index) => ({ category: item.name, nominee: votes[index] })), [votes]);

    useEffect(() => {
        supabase.from('votes').select('category, nominee').eq('user_id', userId).then(({ data, error }) => {
            if (!error && data?.length) {
                const previousVotes: Record<number, string> = {};
                data.forEach((row) => {
                    const index = categories.findIndex((item) => item.name === row.category);
                    if (index >= 0) previousVotes[index] = row.nominee;
                });
                setVotes(previousVotes);
                if (data.length >= categories.length) setSubmitted(true);
            }
            setCheckingVote(false);
        });
    }, [userId]);

    const choose = (nominee: string) => { setVotes((current) => ({ ...current, [step]: nominee })); setError(''); };
    const next = () => {
        if (!votes[step]) return setError('Selecciona un nominado para continuar.');
        setError('');
        setStep((current) => Math.min(current + 1, categories.length - 1));
    };
    const submit = async () => {
        if (!votes[step]) return setError('Selecciona un nominado para completar tu votación.');
        setSending(true);
        setError('');
        try {
            const rows = categories.map((item, index) => ({ user_id: userId, category: item.name, nominee: votes[index] }));
            const { error: insertError } = await supabase.from('votes').insert(rows);
            if (insertError?.code === '23505') throw new Error('Esta cuenta ya registró su votación.');
            if (insertError) throw insertError;
            localStorage.setItem('pma-vote-2026', JSON.stringify({ votes, submittedAt: new Date().toISOString() }));
            setSubmitted(true);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'No fue posible registrar los votos.');
        } finally {
            setSending(false);
        }
    };

    if (checkingVote) return <p className="auth-loading">Comprobando tu votación…</p>;

    if (submitted) return (
        <div className="ballot-success" role="status" aria-live="polite">
            <span className="ballot-success-icon" aria-hidden="true">✓</span>
            <span className="mono section-eyebrow">Voto registrado</span>
            <h3>¡Gracias por ser parte de los PMA!</h3>
            <p>Completaste las 20 categorías. Puedes consultar tus elecciones a continuación.</p>
            <details className="vote-summary">
                <summary>Ver resumen de votos</summary>
                <ol>{summary.map((item) => <li key={item.category}><strong>{item.category}</strong><span>{item.nominee}</span></li>)}</ol>
            </details>
        </div>
    );

    return (
        <form className="ballot" onSubmit={(event) => event.preventDefault()}>
            <div className="ballot-progress-copy"><span className="mono">Categoría {step + 1} de {categories.length}</span><span>{answered} respondidas</span></div>
            <div className="ballot-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / categories.length) * 100}%` }} /></div>
            <fieldset className="ballot-category">
                <legend>{category.name}</legend>
                <p>{category.description}</p>
                <div className="nominee-grid">
                    {category.nominees.map((nominee, index) => {
                        const id = `category-${step}-nominee-${index}`;
                        return <label className={`nominee-option ${votes[step] === nominee ? 'selected' : ''}`} htmlFor={id} key={nominee}>
                            <input id={id} type="radio" name={`category-${step}`} checked={votes[step] === nominee} onChange={() => choose(nominee)} />
                            <span className="nominee-number">{String(index + 1).padStart(2, '0')}</span><span>{nominee}</span><span className="nominee-check" aria-hidden="true">✓</span>
                        </label>;
                    })}
                </div>
            </fieldset>
            <div className="ballot-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setStep((current) => Math.max(current - 1, 0)); setError(''); }} disabled={step === 0}>Anterior</button>
                <div className="ballot-status" role="alert">{error}</div>
                {step < categories.length - 1 ? <button type="button" className="btn btn-gold" onClick={next}>Siguiente</button> : <button type="button" className="btn btn-gold" onClick={submit} disabled={sending}>{sending ? 'Enviando…' : 'Enviar mis votos'}</button>}
            </div>
        </form>
    );
}
