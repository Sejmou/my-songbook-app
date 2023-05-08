import classNames from 'classnames';
import { useSongStore } from '../store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, TouchableOpacity, Alert } from 'react-native';
import { MainHeading, RegularText } from './typography';

type Props = {
  className?: string;
};

const Songs = (props: Props) => {
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
    <View className={classNames('w-full flex flex-col', props.className)}>
      <MainHeading>Songs</MainHeading>
      {songs.length === 0 ? (
        <RegularText>No songs yet. Add one!</RegularText>
      ) : (
        <>
          {songs.map(song => (
            <TouchableOpacity
              key={song.id}
              onPress={() => handleSongPress(song.id)}
              className="flex flex-row items-center p-2"
            >
              <View className="flex-1">
                <RegularText additionalClassNames="font-bold">
                  {song.title}
                </RegularText>
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
          ))}
        </>
      )}
    </View>
  );
};

export default Songs;
