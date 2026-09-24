import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { categories } from './VotingForm';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type Result = { category: string; nominee: string; votes: number };

export default function ResultsChart() {
    const [results, setResults] = useState<Result[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'unconfigured' | 'error'>('loading');
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const loadResults = useCallback(async () => {
        if (!isSupabaseConfigured) return setStatus('unconfigured');
        const { data, error } = await supabase.rpc('get_vote_results');
        if (error) return setStatus('error');
        setResults((data || []).map((row) => ({ ...row, votes: Number(row.votes) })));
        setUpdatedAt(new Date());
        setStatus('ready');
    }, []);

    useEffect(() => {
        loadResults();
        const timer = window.setInterval(loadResults, 10000);
        const refreshOnFocus = () => loadResults();
        window.addEventListener('focus', refreshOnFocus);
        return () => { window.clearInterval(timer); window.removeEventListener('focus', refreshOnFocus); };
    }, [loadResults]);

    const categoryResults = useMemo(() => categories.map((category) => {
        const rows = results
            .filter((row) => row.category === category.name)
            .sort((a, b) => b.votes - a.votes);
        const total = rows.reduce((sum, row) => sum + row.votes, 0);
        return { ...category, rows, total, leader: rows[0] };
    }), [results]);

    return <section className="results-card results-dashboard" aria-labelledby="results-title" aria-live="polite">
        <div className="results-heading">
            <div><span className="mono section-eyebrow">Resultados en vivo</span><h2 id="results-title">Así va la votación</h2></div>
            <div className="live-results-status"><i aria-hidden="true" /><span>Actualización automática</span><strong>{updatedAt ? updatedAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</strong></div>
        </div>

        {status === 'unconfigured' && <p className="results-message">La gráfica aparecerá cuando conectes Supabase en el archivo <code>.env</code>.</p>}
        {status === 'loading' && <p className="results-message">Cargando resultados…</p>}
        {status === 'error' && <p className="results-message">No pudimos consultar los resultados en este momento.</p>}

        {status === 'ready' && <div className="results-category-grid">
            {categoryResults.map((category, categoryIndex) => {
                const leaderPercent = category.total && category.leader ? Math.round((category.leader.votes / category.total) * 100) : 0;
                return <article className="result-category-card" key={category.name}>
                    <div className="result-category-topline"><span className="mono">{String(categoryIndex + 1).padStart(2, '0')}</span><span>{category.total} votos</span></div>
                    <h3>{category.name}</h3>
                    {category.total === 0 ? <p className="result-empty">Aún no hay votos.</p> : <>
                        <div className="result-leader">
                            <div className="mini-donut" style={{ '--result': `${leaderPercent * 3.6}deg` } as CSSProperties}><span>{leaderPercent}%</span></div>
                            <div><small>Liderando</small><strong>{category.leader.nominee}</strong></div>
                        </div>
                        <ol className="result-ranking">
                            {category.rows.slice(0, 3).map((row, index) => {
                                const percent = Math.round((row.votes / category.total) * 100);
                                return <li key={row.nominee}>
                                    <div><span>{index + 1}. {row.nominee}</span><strong>{percent}%</strong></div>
                                    <div className="result-bar" aria-label={`${row.nominee}: ${row.votes} votos, ${percent}%`}><span style={{ width: `${percent}%` }} /></div>
                                </li>;
                            })}
                        </ol>
                    </>}
                </article>;
            })}
        </div>}
    </section>;
}
