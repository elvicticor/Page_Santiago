import React from 'react';
import { useStore } from '@nanostores/react';
import { isPlaying, currentTrack, togglePlay } from '../stores/playerStore';

const Player = () => {
    const $isPlaying = useStore(isPlaying);
    const $currentTrack = useStore(currentTrack);

    return (
        <div className="player">
            <div className="track-info">
                <span className="track-title">{$currentTrack ? $currentTrack.title : 'NEON_PULSE.wav'}</span>
                <span className="track-artist mono">{$currentTrack ? $currentTrack.artist : 'UNKNOWN_ARTIST'}</span>
            </div>
            <div className="controls">
                <button className="btn-play" onClick={togglePlay}>
                    {$isPlaying ? (
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><rect x="1" y="1" width="4" height="16" /><rect x="9" y="1" width="4" height="16" /></svg>
                    ) : (
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1V17L13 9L1 1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="mono" style={{ fontSize: '0.8rem' }}>00:00 / {$currentTrack ? $currentTrack.duration : '03:45'}</div>
        </div>
    );
};

export default Player;
