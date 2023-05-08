import BouncyCheckbox from 'react-native-bouncy-checkbox';
import colors from 'tailwindcss/colors';

type Props = {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CheckboxInput = (props: Props) => {
  return (
    <BouncyCheckbox
      id={props.id}
      isChecked={props.checked}
      text={props.label}
      onPress={() => {
        props.onChange(!props.checked);
      }}
      textStyle={{
        textDecorationLine: 'none',
        color: props.checked ? colors.black : colors.gray[500],
      }}
      fillColor={colors.purple[900]}
      disableBuiltInState
    />
  );
};

export default CheckboxInput;
