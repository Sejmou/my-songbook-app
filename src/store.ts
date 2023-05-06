import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MIDIInputWithListeners } from './hooks/midi/midi-input';

type SongStore = {
  songs: Song[];
  addSong: (song: NewSong) => void;
  removeSong: (id: string) => void;
  setCurrentSong: (id: string) => void;
  currentSongId?: string;

  showSectionHeadingsOnly: boolean;
  setShowSectionHeadingsOnly: (show: boolean) => void;

  midiInput?: MIDIInputWithListeners;
  setMidiInput: (input?: MIDIInputWithListeners) => void;
};

type NewSong = {
  title: string;
  artist: string;
  lyrics: string;
};

type Song = NewSong & {
  id: string;
};

export const useSongStore = create<SongStore>()(
  devtools(
    persist(
      (set, get) => ({
        songs: [],
        addSong: song =>
          set(state => ({
            songs: [
              ...state.songs,
              {
                ...song,
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                id: song.title + song.artist + song.lyrics + Math.random(),
              },
            ],
          })),
        removeSong: id => {
          const currentSongs = get().songs;
          const currentSongId = get().currentSongId;
          const filteredSongs = currentSongs.filter(s => s.id !== id);
          set(() => ({
            songs: filteredSongs,
          }));
          if (!filteredSongs.find(s => s.id === currentSongId)) {
            set(() => ({
              currentSongId: undefined,
            }));
          }
        },
        setCurrentSong: id =>
          set(state => ({
            currentSongId: state.songs.find(s => s.id === id)?.id,
          })),
        showSectionHeadingsOnly: false,
        setShowSectionHeadingsOnly: show =>
          set(() => ({
            showSectionHeadingsOnly: show,
          })),
        setMidiInput: input =>
          set(() => ({
            midiInput: input,
          })),
      }),

      {
        name: 'song-storage', // name of the item in the storage (must be unique)
        getStorage: () => AsyncStorage,
      }
    )
  )
);

export function useCurrentSong() {
  const currentSongId = useSongStore(state => state.currentSongId);
  const currentSong = useSongStore(state =>
    state.songs.find(s => s.id === currentSongId)
  );
  return currentSong;
}
