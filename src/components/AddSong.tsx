import { View, Button, Text, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { useSongStore } from '../store';
import CustomTextInput from './CustomTextInput';

const AddSong = () => {
  const addSong = useSongStore(state => state.addSong);

  return (
    <Formik
      initialValues={{ title: '', artist: '', lyrics: '' }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values.title || !values.artist || !values.lyrics) {
          return;
        }
        addSong(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <View className="flex flex-col gap-1 h-full">
          <Text className="text-2xl font-bold">Add a new song</Text>
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
          <ScrollView
            className="overflow-scroll flex-grow-0 max-h-[200px]"
            bounces={false}
          >
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
          <Button
            disabled={
              isSubmitting || !values.title || !values.artist || !values.lyrics
            }
            onPress={handleSubmit as any}
            title="Add Song"
          />
        </View>
      )}
    </Formik>
  );
};

export default AddSong;
