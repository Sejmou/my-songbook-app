import React from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  className?: string;
  children: React.ReactNode;
  onPress: () => void;
};

const IconButton = (props: Props) => {
  return (
    <Pressable onPress={props.onPress}>
      <View className={props.className}>{props.children}</View>
    </Pressable>
  );
};

export default IconButton;
