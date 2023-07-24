import { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import CustomTextInput from './CustomTextInput';
import { useSongStore } from '../store/songs';

type Song = {
  title: string;
  artist: string;
  lyrics: string;
};

type FormProps = {
  initialValues?: Song;
  onSubmit: (values: Song, helpers: FormikHelpers<Song>) => void;
  onCancel: () => void;
  variant: 'add' | 'edit';
};

const SongForm = ({
  initialValues,
  onSubmit,
  onCancel,
  variant,
}: FormProps) => {
  const [rerenderHackKey, setRerenderHackKey] = useState(0);

  useEffect(() => {
    // This is a hack to make sure that the form is re-rendered (values updated) when the initialValues change.
    setRerenderHackKey(prev => prev + 1);
  }, [initialValues]);

  return (
    <Formik
      key={rerenderHackKey}
      initialValues={initialValues || { title: '', artist: '', lyrics: '' }}
      onSubmit={(values, helpers) => {
        const { setSubmitting } = helpers;
        if (!values.title || !values.artist || !values.lyrics) {
          Alert.alert('Please fill out all fields!');
          setSubmitting(false);
          return;
        }
        onSubmit(values, helpers);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <View className="flex flex-col gap-1 flex-1">
          <CustomTextInput
            id="title"
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            value={values.title}
            placeholder="Title"
          />
          <CustomTextInput
            id="artist"
            onChangeText={handleChange('artist')}
            onBlur={handleBlur('artist')}
            value={values.artist}
            placeholder="Artist"
          />
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
          <View className="pt-2 flex flex-row">
            <View className="flex-1">
              <Button
                disabled={isSubmitting}
                onPress={handleSubmit as any}
                title={variant === 'add' ? 'Add' : 'Save'}
              />
            </View>
            <View className="w-2"></View>
            <View className="flex-1">
              <Button onPress={onCancel} title="Cancel" color="red" />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SongForm;
