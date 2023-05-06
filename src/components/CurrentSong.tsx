import { useMemo } from 'react';
import { useCurrentSong, useSongStore } from '../store';
import CheckboxInput from './CheckboxInput';
import { Text, TouchableOpacity, View } from 'react-native';
import { MainHeading, RegularText, SubHeading } from './typography';
import classNames from 'classnames';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  className?: string;
};

const CurrentSong = (props: Props) => {
  const currentSong = useCurrentSong();
  const setCurrentView = useSongStore(state => state.setCurrentView);

  const lyricBlocks = useMemo(
    () =>
      currentSong ? splitIntoBlocksBySectionHeading(currentSong.lyrics) : [],
    [currentSong]
  );
  const lyricBlockIds = useMemo(
    () => lyricBlocks.map((b, i) => `${b.name}-${i}`),
    [lyricBlocks]
  );

  const showSectionHeadingsOnly = useSongStore(
    state => state.showSectionHeadingsOnly
  );

  if (!currentSong) {
    return (
      <View className={props.className}>
        <Text>Select a song. Its lyrics will show up here.</Text>
      </View>
    );
  }

  return (
    <View className={props.className}>
      <View className="flex flex-row items-center">
        <TouchableOpacity
          className="w-8 h-8 mx-4"
          onPress={() => setCurrentView('songs')}
        >
          <View>
            <Ionicons name="md-arrow-back-outline" size={32} color="gray" />
          </View>
        </TouchableOpacity>
        <View className="mb-4 flex flex-col">
          <MainHeading>{currentSong.title || 'No Title'}</MainHeading>
          <SubHeading>
            by{' '}
            <Text className="font-semibold">
              {currentSong.artist || 'No Artist'}
            </Text>
          </SubHeading>
        </View>
      </View>
      <SectionHeadingsCheckbox />
      <View className="flex flex-col mt-4">
        {lyricBlocks.map((b, i) => (
          <View
            key={i}
            id={lyricBlockIds[i]}
            className={classNames(
              { 'mt-8': i !== 0 && !showSectionHeadingsOnly },
              { 'mt-4': i !== 0 && showSectionHeadingsOnly }
            )}
          >
            <RegularText additionalClassNames="font-bold">{b.name}</RegularText>
            {!showSectionHeadingsOnly && (
              <View>
                {b.content.split('\n').map((line, i) => (
                  <RegularText key={i}>{line}</RegularText>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const SectionHeadingsCheckbox = () => {
  const showSectionHeadingsOnly = useSongStore(
    state => state.showSectionHeadingsOnly
  );
  const setShowSectionHeadingsOnly = useSongStore(
    state => state.setShowSectionHeadingsOnly
  );

  return (
    <CheckboxInput
      id="show-section-headings-only"
      label={'Only show song structure'}
      checked={showSectionHeadingsOnly}
      onChange={checked => setShowSectionHeadingsOnly(checked)}
    />
  );
};

export default CurrentSong;

function splitIntoBlocksBySectionHeading(lyrics: string) {
  // example section heading: [Verse 1]

  // this regex matches the section heading and content until the next section heading or the end of the string
  const regex = /^\[(.+?)\]\n([\s\S]*?)(?=^\[|\Z)/gm;

  const blocks = [];
  let match;
  while ((match = regex.exec(lyrics))) {
    const block = {
      name: match[1] || '',
      content: match[2]?.trim() || '',
    };
    blocks.push(block);
  }

  // match final section heading without content
  const finalSectionHeading = lyrics.match(/\[(.+?)\]\n?$/);
  if (finalSectionHeading) {
    const block = {
      name: finalSectionHeading[1] || '',
      content: '',
    };
    blocks.push(block);
  }

  return blocks;
}
