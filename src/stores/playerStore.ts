import { atom } from 'nanostores';

export interface Track {
    title: string;
    artist: string;
    src: string;
    duration: string;
}

export const isPlaying = atom(false);
export const currentTrack = atom<Track | null>(null);
export const showPlayer = atom(true); // Always show or conditionally?

export function playTrack(track: Track) {
    currentTrack.set(track);
    isPlaying.set(true);
}

export function togglePlay() {
    isPlaying.set(!isPlaying.get());
}

export function pause() {
    isPlaying.set(false);
}
