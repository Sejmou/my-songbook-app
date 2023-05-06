import classNames from 'classnames';
import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  className?: string;
};

const CustomTextInput = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <TextInput
      className={classNames(
        'border border-purple-900 border-purple p-2 bg-purple-100 rounded-sm text-purple-950',
        className
      )}
      {...rest}
    ></TextInput>
  );
};

export default CustomTextInput;
