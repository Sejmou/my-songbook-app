import { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '../../components/CustomTextInput';
import { useSongStore } from '../../store';
import type { NewSong } from '../../store';

type FormProps = {
  initialValues?: NewSong;
};

const NewSongForm = ({ initialValues }: FormProps) => {
  const addSong = useSongStore(state => state.addSong);
  const setCurrentView = useSongStore(state => state.setCurrentView);

  const [rerenderHackKey, setRerenderHackKey] = useState(0);

  useEffect(() => {
    // This is a hack to make sure that the form is re-rendered (values updated) when the initialValues change.
    setRerenderHackKey(prev => prev + 1);
  }, [initialValues]);

  return (
    <Formik
      key={rerenderHackKey}
      initialValues={initialValues || { title: '', artist: '', lyrics: '' }}
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
        <View className="flex flex-col gap-1 flex-1">
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
          <View className="flex-1">
            <CustomTextInput
              id="lyrics"
              className="h-full"
              scrollEnabled={true}
              placeholder="Add your own lyrics here :)"
              multiline
              numberOfLines={4}
              onChangeText={handleChange('lyrics')}
              onBlur={handleBlur('lyrics')}
              value={values.lyrics}
            />
          </View>
          <View className="mb-8 flex flex-row">
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

export default NewSongForm;
