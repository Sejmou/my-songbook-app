import { View, Button, Text } from 'react-native';
import { useCurrentSong, useSongStore } from '../store/songs';
import { MainHeading } from '../components/typography';
import PageHeader from '../components/PageHeader';
import SongForm from '../components/SongForm';

const EditSong = () => {
  const updateSong = useSongStore(state => state.updateSong);
  const currentSong = useCurrentSong();
  const setCurrentView = useSongStore(state => state.setCurrentView);
  if (!currentSong) {
    return (
      <View>
        <Text>Something went wrong - could not find song!</Text>{' '}
        <Button
          title="Back to Song List"
          onPress={() => setCurrentView('songs')}
        />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-1 h-full">
      <PageHeader>
        <MainHeading>Edit song</MainHeading>
      </PageHeader>
      <SongForm
        initialValues={{
          title: currentSong.title,
          artist: currentSong.artist,
          lyrics: currentSong.lyrics,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          updateSong({ ...values, id: currentSong.id });
          setSubmitting(false);
          setCurrentView('songs');
          resetForm();
        }}
        onCancel={() => setCurrentView('songs')}
      />
    </View>
  );
};

export default EditSong;
