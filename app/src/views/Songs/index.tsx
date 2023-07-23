import classNames from 'classnames';
import { useSongStore } from '../../store';
import { View, Text, TouchableOpacity, Dimensions, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MainHeading } from '../../components/typography';
import SongList from './SongList';
import SongSyncButtons from './SongSyncButtons';

const Songs = () => {
  const setCurrentView = useSongStore(state => state.setCurrentView);
  const width = Dimensions.get('window').width;

  return (
    <View className="h-full pb-8">
      <View className="flex flex-row w-full">
        <View className="flex-1"></View>
        <Text
          className={classNames(
            'font-extrabold tracking-tight text-center',
            { 'text-4xl': width < 400 },
            { 'text-5xl': width >= 400 }
          )}
        >
          My <Text className="text-purple-500">Song</Text>Book
        </Text>
        <View className="flex-1 flex flex-row justify-end items-center">
          <TouchableOpacity
            className="w-8 h-8 mx-4"
            onPress={() => setCurrentView('midi-input-config')}
          >
            <View>
              <Ionicons name="md-settings-outline" size={32} color="gray" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row w-full">
        <MainHeading>Songs</MainHeading>
        <SongSyncButtons />
      </View>
      <SongList />
      <Button title="Add New Song" onPress={() => setCurrentView('add-song')} />
    </View>
  );
};

export default Songs;
