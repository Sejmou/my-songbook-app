import { StatusBar } from 'expo-status-bar';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import SongView from './components/CurrentSong';
import Songs from './components/Songs';
import MIDIInputConfig from './components/MIDIInputConfig';
import AddSong from './components/AddSong';
import { useSongStore } from './store';
import { useMemo } from 'react';
import EditSong from './components/EditSong';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  const currentViewName = useSongStore(state => state.currentView);
  const setCurrentView = useSongStore(state => state.setCurrentView);

  const currentView = useMemo(() => {
    switch (currentViewName) {
      case 'songs':
        return (
          <>
            <View className="flex flex-row w-full">
              <View className="flex-1"></View>
              <Text className="text-5xl font-extrabold tracking-tight text-center">
                My <Text className="text-purple-500">Song</Text>Book
              </Text>
              <View className="flex-1 flex flex-row justify-end items-center">
                <TouchableOpacity
                  className="w-8 h-8 mx-4"
                  onPress={() => setCurrentView('midi-input-config')}
                >
                  <View>
                    <Ionicons
                      name="md-settings-outline"
                      size={32}
                      color="gray"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <Songs />
            <Button
              title="Add New Song"
              onPress={() => setCurrentView('add-song')}
            />
          </>
        );
      case 'current-song':
        return <SongView />;
      case 'add-song':
        return <AddSong />;
      case 'midi-input-config':
        return <MIDIInputConfig />;
      case 'edit-song':
        return <EditSong />;
      default:
        return null;
    }
  }, [currentViewName]);

  return (
    <View className="mt-8 mx-4 flex flex-col">
      <StatusBar style="auto" />
      {currentView}
    </View>
  );
}
