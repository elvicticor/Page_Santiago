import React from 'react';
import { useStore } from '@nanostores/react';
import { playTrack, currentTrack, isPlaying } from '../stores/playerStore';

const tracks = [
    { id: '01', title: 'NEON_PULSE', artist: 'SERGIO_SANTIAGO', duration: '03:45', src: 'NEON_PULSE.wav' },
    { id: '02', title: 'SYSTEM_FAILURE', artist: 'SERGIO_SANTIAGO', duration: '04:12', src: 'SYSTEM_FAILURE.wav' },
    { id: '03', title: 'CYBER_DREAM', artist: 'SERGIO_SANTIAGO', duration: '02:58', src: 'CYBER_DREAM.wav' },
    { id: '04', title: 'DATA_CORRUPTION', artist: 'SERGIO_SANTIAGO', duration: '05:01', src: 'DATA_CORRUPTION.wav' },
];

const AudioArchive = () => {
    const $currentTrack = useStore(currentTrack);
    const $isPlaying = useStore(isPlaying);

    return (
        <section id="archive" className="container">
            <div className="section-header">
                <h3>/// AUDIO_ARCHIVE</h3>
                <span className="mono" style={{ color: 'var(--cyan)' }}>SELECT_TRACK</span>
            </div>
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>#</th>
                            <th>TRACK_NAME</th>
                            <th>ARTIST</th>
                            <th style={{ textAlign: 'right' }}>DURATION</th>
                        </tr>
                    </thead>
                    <tbody id="playlist-body">
                        {tracks.map((track) => {
                            const isActive = $currentTrack?.title === track.title;
                            return (
                                <tr
                                    key={track.id}
                                    className="track-row"
                                    onClick={() => playTrack(track)}
                                    style={isActive ? { background: '#111', color: 'var(--cyan)' } : {}}
                                >
                                    <td className="mono" style={{ color: 'var(--muted)' }}>{track.id}</td>
                                    <td>{track.title}</td>
                                    <td className="mono" style={{ color: 'var(--muted)' }}>{track.artist}</td>
                                    <td className="mono" style={{ textAlign: 'right' }}>{track.duration}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AudioArchive;
