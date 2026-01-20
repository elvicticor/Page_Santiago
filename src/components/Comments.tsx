import React, { useState } from 'react';

interface Comment {
    name: string;
    msg: string;
    time: string;
}

const Comments = () => {
    const [comments, setComments] = useState<Comment[]>([
        { name: 'USER_001', time: 'Hace 2 horas', msg: '¡Increíble música! Dios te bendiga.' },
        { name: 'NEON_PILGRIM', time: 'Hace 5 horas', msg: 'Esperando el concierto en Bogotá. #GLYTCH' }
    ]);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && msg) {
            const newComment = {
                name: name.toUpperCase(),
                time: 'AHORA_MISMO',
                msg: msg
            };
            setComments([newComment, ...comments]);
            setName('');
            setMsg('');
        }
    };

    return (
        <section id="comments" className="container">
            <div className="section-header">
                <h3>/// FAN_ZONE</h3>
                <span className="mono" style={{ color: 'var(--cyan)' }}>TRANSMISIÓN_DE_DATOS</span>
            </div>
            <div className="comments-grid">
                <div className="comment-form-container">
                    <h4 className="mono" style={{ marginBottom: '20px' }}>DEJAR_MENSAJE:</h4>
                    <form id="comment-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="NOMBRE // ALIAS"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                            placeholder="MENSAJE..."
                            required
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button type="submit" className="mono btn-submit">ENVIAR_DATOS</button>
                    </form>
                </div>
                <div className="comments-display">
                    <h4 className="mono" style={{ marginBottom: '20px' }}>LOG_DE_COMUNICACIÓN:</h4>
                    <div id="comments-list">
                        {comments.map((comment, index) => (
                            <div className="comment-item" key={index} style={index === 0 && comment.time === 'AHORA_MISMO' ? { animation: 'flash 0.5s' } : {}}>
                                <span className="comment-user mono">{comment.name}</span>
                                <span className="comment-time mono">{comment.time}</span>
                                <p className="comment-text">{comment.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comments;
