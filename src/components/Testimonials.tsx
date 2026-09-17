import React, { useState } from 'react';

interface Comment {
    name: string;
    msg: string;
    time: string;
}

const Testimonials = () => {
    const [comments, setComments] = useState<Comment[]>([
        { name: 'MARÍA G.', time: 'Hace 2 horas', msg: '¡Qué bendición que exista un espacio así para la música cristiana! Ya voté por mis favoritos.' },
        { name: 'JUAN P.', time: 'Hace 5 horas', msg: 'Esperando la gala en Bogotá con muchas ganas. #PraiseMusicAwards' }
    ]);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && msg) {
            const newComment = {
                name: name.toUpperCase(),
                time: 'Ahora mismo',
                msg: msg
            };
            setComments([newComment, ...comments]);
            setName('');
            setMsg('');
        }
    };

    return (
        <section id="testimonios" className="container">
            <div className="section-header reveal">
                <h3>Mensajes de la comunidad</h3>
                <span className="mono section-eyebrow">TESTIMONIOS</span>
            </div>
            <div className="comments-grid reveal">
                <div className="comment-form-container">
                    <h4 style={{ marginBottom: '20px', textTransform: 'none' }}>Deja tu mensaje:</h4>
                    <form id="comment-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                            placeholder="Comparte tu mensaje de apoyo..."
                            required
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button type="submit" className="btn-submit">Enviar mensaje</button>
                    </form>
                </div>
                <div className="comments-display">
                    <h4 style={{ marginBottom: '20px', textTransform: 'none' }}>Lo que dice la comunidad:</h4>
                    <div id="comments-list">
                        {comments.map((comment, index) => (
                            <div className="comment-item" key={index}>
                                <span className="comment-user">{comment.name}</span>
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

export default Testimonials;
