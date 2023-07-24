import {
  View,
  Button,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import { Formik, useFormikContext } from 'formik';
import CustomTextInput from '../../components/CustomTextInput';
import {
  MainHeading,
  RegularText,
  SmallText,
} from '../../components/typography';
import { useSongSearch, type SongSearchResult } from '../../hooks/use-api';
import { useCallback, useEffect } from 'react';
import IconButton from '../../components/IconButton';
import { fetchAndExtractLyrics } from '../../hooks/use-genius-lyrics';

type ModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onSongSelected(song: SelectedSong): void;
};

type SelectedSong = {
  title: string;
  artist: string;
  lyrics: string;
};

type SongSearch = {
  query: string;
};

const initialSongSearchValue: SongSearch = {
  query: '',
};

const SongSearchModal = ({
  visible,
  onRequestClose,
  onSongSelected,
}: ModalProps) => {
  const { sendSearchQuery, searchResults, errorMessage, resetSearchResults } =
    useSongSearch();
  const handleSongSelect = useCallback((song: SongSearchResult) => {
    fetchAndExtractLyrics(song.url).then(lyrics => {
      onSongSelected({ title: song.title, artist: song.artists, lyrics });
      resetSearchResults();
      onRequestClose();
    });
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        className="mx-4 flex flex-col h-full pb-24" // absolutely no freaking clue why I need to add that bottom padding
        style={{
          marginTop: Constants.statusBarHeight + 4,
        }}
      >
        <MainHeading>Search for a Song</MainHeading>
        <Formik initialValues={initialSongSearchValue} onSubmit={() => {}}>
          {({ values, handleChange, handleBlur }) => (
            <View className="flex-row">
              <IconButton iconName="arrow-back" onPress={onRequestClose} />
              <CustomTextInput
                id="title"
                className="flex-1"
                onChangeText={handleChange('query')}
                onBlur={handleBlur('query')}
                value={values.query}
                placeholder="Search Genius.com"
              />
              <View className="w-1"></View>
              <TriggerSearch
                onSearch={query => sendSearchQuery(query)}
                onSearchReset={resetSearchResults}
              />
            </View>
          )}
        </Formik>
        {errorMessage && (
          <RegularText>
            An error occured while processing your search: {errorMessage}
          </RegularText>
        )}
        <View className="h-4" />
        <ScrollView className="flex-1" bounces={false}>
          {searchResults.map((result, i) => (
            <TouchableOpacity key={i} onPress={() => handleSongSelect(result)}>
              <View className="flex flex-row w-full">
                <Image
                  className="w-24 h-24"
                  source={{ uri: result.thumbnail }}
                />
                <View className="border p-2 pb-4 flex-1">
                  <RegularText additionalClassNames="font-semibold">
                    {result.title}
                  </RegularText>
                  <SmallText>{result.artists}</SmallText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

type SearchProps = {
  onSearch(query: string): void;
  onSearchReset(): void;
};

const TriggerSearch = ({ onSearch, onSearchReset }: SearchProps) => {
  const { values } = useFormikContext<SongSearch>();
  useEffect(() => {
    if (values.query.length > 2) {
      onSearch(values.query);
    } else {
      onSearchReset();
    }
  }, [values]);
  return null;
};

export default SongSearchModal;
