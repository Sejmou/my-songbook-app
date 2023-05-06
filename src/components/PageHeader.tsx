import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSongStore } from '../store';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  children: React.ReactNode;
};

const PageHeader = ({ children }: Props) => {
  const setCurrentView = useSongStore(state => state.setCurrentView);

  return (
    <View className="flex flex-row items-center">
      <TouchableOpacity
        className="w-8 h-8 mx-4"
        onPress={() => setCurrentView('songs')}
      >
        <View>
          <Ionicons name="md-arrow-back-outline" size={32} color="gray" />
        </View>
      </TouchableOpacity>
      {children}
    </View>
  );
};

export default PageHeader;
