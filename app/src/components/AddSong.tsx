import { View, Button, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { useSongStore } from '../store';
import CustomTextInput from './CustomTextInput';
import { Alert } from 'react-native';
import { MainHeading } from './typography';
import PageHeader from './PageHeader';

const AddSong = () => {
  const addSong = useSongStore(state => state.addSong);
  const setCurrentView = useSongStore(state => state.setCurrentView);

  return (
    <Formik
      initialValues={{ title: '', artist: '', lyrics: '' }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values.title || !values.artist || !values.lyrics) {
          Alert.alert('Please fill out all fields!');
          setSubmitting(false);
          return;
        }
        addSong(values);
        setSubmitting(false);
        setCurrentView('songs');
        resetForm();
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <View className="flex flex-col gap-1 h-full">
          <PageHeader>
            <MainHeading>Add a new song</MainHeading>
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
                title="Add"
              />
            </View>
            <View className="w-1/2">
              <Button
                onPress={() => setCurrentView('songs')}
                title="Cancel"
                color="red"
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default AddSong;
