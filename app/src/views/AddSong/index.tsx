import { View, Button } from 'react-native';
import SongSearchModal from './SongSearchModal';
import { MainHeading } from '../../components/typography';
import PageHeader from '../../components/PageHeader';
import { useState } from 'react';
import SongForm from '../../components/SongForm';
import { useSongStore, type NewSong } from '../../store/songs';

const AddSong = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleSearchButtonClick = () => {
    setModalVisible(true);
  };
  const [songFromGenius, setSongFromGenius] = useState<NewSong | undefined>();
  const addSong = useSongStore(state => state.addSong);
  const setCurrentView = useSongStore(state => state.setCurrentView);

  return (
    <View className="flex h-full">
      <PageHeader>
        <MainHeading>Add a new song</MainHeading>
      </PageHeader>
      <SongSearchModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onSongSelected={song => {
          setSongFromGenius(song);
        }}
      />
      <View className="my-2">
        <Button title="Find on Genius.com" onPress={handleSearchButtonClick} />
      </View>
      <SongForm
        initialValues={songFromGenius}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          addSong(values);
          setSubmitting(false);
          setCurrentView('songs');
          resetForm();
        }}
        onCancel={() => setCurrentView('songs')}
        variant="add"
      />
    </View>
  );
};

export default AddSong;
