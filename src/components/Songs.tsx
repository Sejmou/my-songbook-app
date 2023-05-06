import classNames from 'classnames';
import { useSongStore } from '../store';
// import { FaTrash } from 'react-icons/fa';
import IconButton from './IconButton';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  className?: string;
};

const Songs = (props: Props) => {
  const songs = useSongStore(state => state.songs);
  const setCurrentSong = useSongStore(state => state.setCurrentSong);
  const removeSong = useSongStore(state => state.removeSong);

  return (
    <View className={classNames('w-full flex flex-col', props.className)}>
      <Text className="text-2xl font-bold">Songs</Text>
      {songs.length === 0 ? (
        <Text className="text-base">No songs yet. Add one!</Text>
      ) : (
        <>
          {songs.map(song => (
            <TouchableOpacity
              key={song.id}
              onPress={() => setCurrentSong(song.id)}
              className="flex items-center justify-between cursor-pointer p-2"
            >
              <View className="w-full">
                <Text className="font-bold">{song.title}</Text>
                <Text className="font-semibold">{song.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => removeSong(song.id)}>
                <Text className="text-red-500 font-bold">Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

export default Songs;
