import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { requestMIDIAccess } from '@motiz88/react-native-midi';
import { useEffect } from 'react';
import CurrentSong from './components/CurrentSong';
import Songs from './components/Songs';
import MIDIInputSelect from './components/MIDIInputSelect';
import AddSong from './components/AddSong';

export default function App() {
  return (
    <View className="mt-8 mx-4 flex flex-col">
      <Text className="text-5xl font-extrabold tracking-tight text-center">
        My <Text className="text-purple-500">Song</Text>Book
      </Text>
      <CurrentSong />
      <Songs />
      <MIDIInputSelect />
      <AddSong />
      <StatusBar style="auto" />
    </View>
  );
}
