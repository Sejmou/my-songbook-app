import { SUPER_SECRET_KEY, API_URL } from '@env';
import { useState } from 'react';
import { useSongStore } from '../store';
import { z } from 'zod';

const songsURL = `${API_URL}songs`;
const songResponseValidator = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  lyrics: z.string(),
});
const songsResponseValidator = z.array(songResponseValidator);

export const useSyncToServer = () => {
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'failed'>(
    'idle'
  );
  const localSongs = useSongStore(state =>
    state.songs.filter(s => s.id.startsWith('local-'))
  );
  const updateSong = useSongStore(state => state.updateSong);

  const syncToServer = async () => {
    setSyncState('syncing');
    console.log('uploading', localSongs.length, 'songs');
    console.log(songsURL);

    const responses = await Promise.all(
      localSongs.map(s =>
        fetch(songsURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPER_SECRET_KEY}`,
          },
          body: JSON.stringify(s),
        })
      )
    );
    if (responses.every(r => r.ok)) {
      const syncedSongJSONs = await Promise.all(responses.map(r => r.json()));
      const syncedSongs = syncedSongJSONs
        .map(json => songResponseValidator.parse(json))
        .map(s => ({ ...s, id: s.id.toString() }));
      syncedSongs.forEach(updateSong);
      setSyncState('idle');
    } else {
      console.log(
        'Some API requests failed',
        responses.filter(r => !r.ok)
      );
      setSyncState('failed');
    }
  };

  return { syncToServer, syncState };
};

export const useSyncFromServer = () => {
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'failed'>(
    'idle'
  );
  const songs = useSongStore(state => state.songs);
  const addSongFromServer = useSongStore(state => state.addSongFromServer);

  const syncFromServer = async () => {
    setSyncState('syncing');
    console.log('downloading songs');
    console.log(songsURL);

    const response = await fetch(songsURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPER_SECRET_KEY}`,
      },
    });
    if (response.ok) {
      const remoteSongs = songsResponseValidator
        .parse(await response.json())
        .map(s => ({ ...s, id: s.id.toString() }));
      const newSongs = remoteSongs.filter(
        remoteSong => !songs.find(s => s.id === remoteSong.id.toString())
      );

      newSongs.forEach(addSongFromServer);
      setSyncState('idle');
    } else {
      console.log('API request failed', response);
      setSyncState('failed');
    }
  };

  return { syncFromServer, syncState };
};
