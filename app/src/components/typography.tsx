import { Text } from 'react-native';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  additionalClassNames?: string; // can't use className because using it somehow messes with NativeWind and causes styles to not be applied
};

export const MainHeading = ({ additionalClassNames, children }: Props) => {
  return (
    <Text className={classNames('text-4xl font-bold', additionalClassNames)}>
      {children}
    </Text>
  );
};

export const SubHeading = ({ additionalClassNames, children }: Props) => {
  return (
    <Text className={classNames('text-2xl', additionalClassNames)}>
      {children}
    </Text>
  );
};

export const RegularText = ({ additionalClassNames, children }: Props) => {
  return (
    <Text className={classNames('text-base', additionalClassNames)}>
      {children}
    </Text>
  );
};
