import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MIDIInputWithListeners } from './hooks/midi/midi-input';

type ViewName =
  | 'songs'
  | 'current-song'
  | 'edit-song'
  | 'add-song'
  | 'midi-input-config';

type SongStore = {
  currentView: ViewName;
  setCurrentView: (view: ViewName) => void;

  songs: Song[];
  addSong: (song: NewSong) => void;
  addSongFromServer: (song: Song) => void; // songs from the server already have an ID
  updateSong: (song: Song) => void;
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
        currentView: 'songs',
        setCurrentView: view =>
          set(() => ({
            currentView: view,
          })),

        songs: [],
        addSong: song =>
          set(state => ({
            songs: [
              ...state.songs,
              {
                ...song,
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                id: 'local-' + randomID(), // songs that are synced to the server will have a different ID (not starting with 'local-')
              },
            ],
          })),
        addSongFromServer: song =>
          set(state => ({
            songs: [...state.songs, song],
          })),
        updateSong: song =>
          set(state => ({
            songs: state.songs.map(s => (s.id === song.id ? song : s)),
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

function randomID() {
  return Math.random().toString(36).substring(7);
}
