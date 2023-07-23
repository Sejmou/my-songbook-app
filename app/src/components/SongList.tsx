import classNames from 'classnames';
import { useSongStore, type Song } from '../store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, TouchableOpacity, Alert, Text, ScrollView } from 'react-native';
import { RegularText } from './typography';
import { useSyncToServer, useSyncFromServer } from '../hooks/use-api';
import IconButton from './IconButton';

type Props = {
  className?: string;
};

const SongList = (props: Props) => {
  const songs = useSongStore(state => state.songs);
  const setCurrentSong = useSongStore(state => state.setCurrentSong);
  const removeSong = useSongStore(state => state.removeSong);
  const setCurrentView = useSongStore(state => state.setCurrentView);

  const handleSongPress = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (!song) {
      return;
    }
    setCurrentSong(song.id);
    setCurrentView('current-song');
  };

  const handleSongEditPress = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (!song) {
      return;
    }
    setCurrentSong(song.id);
    setCurrentView('edit-song');
  };

  const handleRemovePress = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (!song) {
      return;
    }

    Alert.alert(
      `Are you sure that you want to remove ${song.title} by ${song.artist}?`,
      'This will permanently delete this song.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeSong(id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      className={classNames('w-full flex flex-col', props.className)}
      bounces={false}
    >
      {songs.length === 0 ? (
        <RegularText>No songs yet. Add one!</RegularText>
      ) : (
        <>
          {songs.map(song => (
            <SongListItem
              key={song.id}
              song={song}
              handleSongPress={handleSongPress}
              handleSongEditPress={handleSongEditPress}
              handleRemovePress={handleRemovePress}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

type SongListItemProps = {
  song: Song;
  handleSongPress: (id: string) => void;
  handleSongEditPress: (id: string) => void;
  handleRemovePress: (id: string) => void;
};

const SongListItem = ({
  song,
  handleSongPress,
  handleSongEditPress,
  handleRemovePress,
}: SongListItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => handleSongPress(song.id)}
      className="flex flex-row items-center p-2"
    >
      <View className="flex-1">
        <RegularText additionalClassNames="font-bold">{song.title}</RegularText>
        <RegularText>{song.artist}</RegularText>
      </View>
      <TouchableOpacity
        className="w-8 h-8 mx-4"
        onPress={() => handleSongEditPress(song.id)}
      >
        <View>
          <Ionicons name="md-pencil-outline" size={32} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-8 h-8 mx-4"
        onPress={() => handleRemovePress(song.id)}
      >
        <View>
          <Ionicons name="md-remove-circle" size={32} color="red" />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SongList;
