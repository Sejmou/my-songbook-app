import { Fragment, useMemo } from 'react';
import { useCurrentSong, useSongStore } from '../store';
import CheckboxInput from './CheckboxInput';
import { Text, View } from 'react-native';
import { MainHeading, RegularText, SubHeading } from './typography';
import classNames from 'classnames';

type Props = {
  className?: string;
};

const CurrentSong = (props: Props) => {
  const currentSong = useCurrentSong();

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
      <View className="mb-4 flex flex-col">
        <MainHeading>{currentSong.title || 'No Title'}</MainHeading>
        <SubHeading>
          by{' '}
          <Text className="font-semibold">
            {currentSong.artist || 'No Artist'}
          </Text>
        </SubHeading>
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
