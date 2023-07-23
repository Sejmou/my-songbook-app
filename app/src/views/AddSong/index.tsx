import { View, Button } from 'react-native';
import SongSearchModal from './SongSearchModal';
import { MainHeading } from '../../components/typography';
import PageHeader from '../../components/PageHeader';
import { useState } from 'react';
import NewSongForm from './NewSongForm';
import type { NewSong } from '../../store';

const AddSong = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleSearchButtonClick = () => {
    setModalVisible(true);
  };
  const [songFromGenius, setSongFromGenius] = useState<NewSong | undefined>();

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
      <Button title="Search on Genius.com" onPress={handleSearchButtonClick} />
      <NewSongForm initialValues={songFromGenius} />
    </View>
  );
};

export default AddSong;
