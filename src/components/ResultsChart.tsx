import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories } from './VotingForm';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type Result = { category: string; nominee: string; votes: number };
const colors = ['#d4af37', '#7a1f2b', '#f3d98a', '#886f25', '#a94250', '#e8cf82', '#634b16', '#c77782', '#b99a34', '#8f7d57'];

export default function ResultsChart() {
    const [results, setResults] = useState<Result[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'unconfigured' | 'error'>('loading');
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [categoryIndex, setCategoryIndex] = useState(0);

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

    const current = categoryResults[categoryIndex];
    let pieCursor = 0;
    const pieSegments = current.rows.map((row, index) => {
        const start = pieCursor;
        pieCursor += current.total ? (row.votes / current.total) * 100 : 0;
        return `${colors[index % colors.length]} ${start}% ${pieCursor}%`;
    });
    const pieGradient = pieSegments.length ? `conic-gradient(${pieSegments.join(', ')})` : 'var(--line)';

    const previousCategory = () => setCategoryIndex((index) => (index - 1 + categories.length) % categories.length);
    const nextCategory = () => setCategoryIndex((index) => (index + 1) % categories.length);

    return <section className="results-card results-dashboard" aria-labelledby="results-title" aria-live="polite">
        <div className="results-heading results-heading-paged">
            <div><span className="mono section-eyebrow">Resultados en vivo</span><h2 id="results-title">Así va la votación</h2></div>
            <div className="results-navigation" aria-label="Cambiar categoría">
                <button type="button" className="results-nav-button" onClick={previousCategory} aria-label="Categoría anterior">← Anterior</button>
                <span><strong>{categoryIndex + 1}</strong> de {categories.length}</span>
                <button type="button" className="results-nav-button" onClick={nextCategory} aria-label="Categoría siguiente">Siguiente →</button>
            </div>
        </div>

        {status === 'unconfigured' && <p className="results-message">La gráfica aparecerá cuando conectes Supabase en el archivo <code>.env</code>.</p>}
        {status === 'loading' && <p className="results-message">Cargando resultados…</p>}
        {status === 'error' && <p className="results-message">No pudimos consultar los resultados en este momento.</p>}

        {status === 'ready' && <>
            <div className="current-result-title">
                <span className="mono">Categoría {String(categoryIndex + 1).padStart(2, '0')}</span>
                <h3>{current.name}</h3>
            </div>
            {current.total === 0 ? <p className="results-message">Todavía no hay votos en esta categoría.</p> : <div className="results-content">
                <div className="pie-chart" style={{ background: pieGradient }} role="img" aria-label={`Gráfica de ${current.name}, ${current.total} votos`}><span><strong>{current.total}</strong> votos</span></div>
                <ol className="chart-legend">{current.rows.map((row, index) => {
                    const percent = Math.round((row.votes / current.total) * 100);
                    return <li key={row.nominee}><i style={{ background: colors[index % colors.length] }} /><span>{row.nominee}</span><strong>{percent}%</strong><small>{row.votes} votos</small></li>;
                })}</ol>
            </div>}
            <div className="results-footer-live"><div className="live-results-status"><i aria-hidden="true" /><span>Actualización cada 10 segundos</span><strong>{updatedAt ? updatedAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</strong></div></div>
        </>}
    </section>;
}
