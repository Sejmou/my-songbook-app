import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import Constants from 'expo-constants';
import { View } from 'react-native';
import { useSongStore } from './store';
import Songs from './views/Songs';
import CurrentSong from './views/CurrentSong';
import MIDIInputConfig from './views/MIDIInputConfig';
import AddSong from './views/AddSong';
import EditSong from './views/EditSong';

export default function App() {
  const currentViewName = useSongStore(state => state.currentView);

  const currentView = useMemo(() => {
    switch (currentViewName) {
      case 'songs':
        return <Songs />;
      case 'current-song':
        return <CurrentSong />;
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
    <View
      className="mx-4 flex flex-col"
      style={{
        marginTop: Constants.statusBarHeight + 4,
      }}
    >
      <StatusBar style="auto" />
      {currentView}
    </View>
  );
}
