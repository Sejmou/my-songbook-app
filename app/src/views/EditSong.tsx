import { View, Button, Text, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';
import { useCurrentSong, useSongStore } from '../store';
import CustomTextInput from '../components/CustomTextInput';
import { MainHeading } from '../components/typography';
import PageHeader from '../components/PageHeader';

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
    <Formik
      initialValues={{
        title: currentSong.title,
        artist: currentSong.artist,
        lyrics: currentSong.lyrics,
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values.title || !values.artist || !values.lyrics) {
          Alert.alert('Please fill out all fields!');
          setSubmitting(false);
          return;
        }
        updateSong({ ...values, id: currentSong.id });
        setSubmitting(false);
        setCurrentView('songs');
        resetForm();
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <View className="flex flex-col gap-1 h-full">
          <PageHeader>
            <MainHeading>Edit song</MainHeading>
          </PageHeader>
          <View className="flex-row">
            <CustomTextInput
              id="title"
              className="flex-1"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              placeholder="Title"
            />
            <View className="w-1"></View>
            <CustomTextInput
              id="artist"
              className="flex-1"
              onChangeText={handleChange('artist')}
              onBlur={handleBlur('artist')}
              value={values.artist}
              placeholder="Artist"
            />
          </View>
          <ScrollView className="overflow-scroll flex-1" bounces={false}>
            <CustomTextInput
              className="flex-1"
              id="lyrics"
              placeholder="Paste the lyrics here :)"
              multiline
              numberOfLines={4}
              onChangeText={handleChange('lyrics')}
              onBlur={handleBlur('lyrics')}
              value={values.lyrics}
            />
          </ScrollView>
          <View className="mb-16 flex flex-row">
            <View className="w-1/2">
              <Button
                disabled={isSubmitting}
                onPress={handleSubmit as any}
                title="Update"
              />
            </View>
            <View className="w-1/2">
              <Button onPress={() => setCurrentView('songs')} title="Cancel" />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default EditSong;
