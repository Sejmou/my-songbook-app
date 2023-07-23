import { View } from 'react-native';
import { useSyncToServer, useSyncFromServer } from '../hooks/use-api';
import { RegularText } from './typography';
import IconButton from './IconButton';

const SongSyncButtons = () => {
  const { syncToServer, syncState: uploadStatus } = useSyncToServer();
  const { syncFromServer, syncState: downloadStatus } = useSyncFromServer();

  return (
    <View className="flex flex-row">
      <IconButton iconName="cloud-upload-outline" onPress={syncToServer} />
      <IconButton iconName="cloud-download-outline" onPress={syncFromServer} />
      <RegularText>
        {getUserFriendlyMessage(uploadStatus, 'upload')}
      </RegularText>
      <RegularText>
        {getUserFriendlyMessage(downloadStatus, 'download')}
      </RegularText>
    </View>
  );
};

function getUserFriendlyMessage(
  status: 'idle' | 'syncing' | 'failed',
  type: 'upload' | 'download'
) {
  if (status === 'idle') {
    return '';
  }

  if (status === 'syncing') {
    return `${type}ing...`;
  }

  if (status === 'failed') {
    return `${type} failed`;
  }

  return '';
}

export default SongSyncButtons;
