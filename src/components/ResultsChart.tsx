import { useEffect, useMemo, useState } from 'react';
import { categories } from './VotingForm';

type Result = { category: string; nominee: string; votes: number };
const colors = ['#d4af37', '#7a1f2b', '#f3d98a', '#886f25', '#a94250', '#e8cf82', '#634b16', '#c77782', '#b99a34', '#8f7d57'];

export default function ResultsChart() {
    const [category, setCategory] = useState(categories[0].name);
    const [results, setResults] = useState<Result[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'unconfigured' | 'error'>('loading');

    const loadResults = async () => {
        const url = import.meta.env.PUBLIC_SUPABASE_URL;
        const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) return setStatus('unconfigured');
        try {
            const response = await fetch(`${url}/rest/v1/rpc/get_vote_results`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
            if (!response.ok) throw new Error();
            setResults(await response.json());
            setStatus('ready');
        } catch { setStatus('error'); }
    };

    useEffect(() => {
        loadResults();
        const timer = window.setInterval(loadResults, 30000);
        return () => window.clearInterval(timer);
    }, []);

    const data = useMemo(() => {
        const rows = results.filter((row) => row.category === category).sort((a, b) => b.votes - a.votes);
        const total = rows.reduce((sum, row) => sum + Number(row.votes), 0);
        let cursor = 0;
        const segments = rows.map((row, index) => {
            const start = cursor;
            cursor += total ? (Number(row.votes) / total) * 100 : 0;
            return `${colors[index % colors.length]} ${start}% ${cursor}%`;
        });
        return { rows, total, gradient: segments.length ? `conic-gradient(${segments.join(', ')})` : 'var(--line)' };
    }, [category, results]);

    return <section className="results-card" aria-labelledby="results-title">
        <div className="results-heading">
            <div><span className="mono section-eyebrow">Resultados en vivo</span><h2 id="results-title">Así va la votación</h2></div>
            <label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        </div>
        {status === 'unconfigured' && <p className="results-message">La gráfica aparecerá cuando conectes Supabase en el archivo <code>.env</code>.</p>}
        {status === 'loading' && <p className="results-message">Cargando resultados…</p>}
        {status === 'error' && <p className="results-message">No pudimos consultar los resultados en este momento.</p>}
        {status === 'ready' && data.total === 0 && <p className="results-message">Todavía no hay votos en esta categoría.</p>}
        {status === 'ready' && data.total > 0 && <div className="results-content">
            <div className="pie-chart" style={{ background: data.gradient }} role="img" aria-label={`Gráfica de ${category}, ${data.total} votos`}><span><strong>{data.total}</strong> votos</span></div>
            <ol className="chart-legend">{data.rows.map((row, index) => <li key={row.nominee}><i style={{ background: colors[index % colors.length] }} /><span>{row.nominee}</span><strong>{Math.round((Number(row.votes) / data.total) * 100)}%</strong><small>{row.votes} votos</small></li>)}</ol>
        </div>}
        <p className="results-updated">Actualización automática cada 30 segundos.</p>
    </section>;
}
