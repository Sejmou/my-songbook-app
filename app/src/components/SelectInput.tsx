import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import { StyleSheet, View, Text } from 'react-native';

type Props = PickerSelectProps & {
  className?: string;
  label: string;
};

const SelectInput = (props: Props) => {
  const { className, label, ...rest } = props;
  return (
    <View className={className}>
      <Text>{label}</Text>
      <RNPickerSelect
        {...rest}
        style={{
          ...pickerSelectStyles,
        }}
      />
    </View>
  );
};

export default SelectInput;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
