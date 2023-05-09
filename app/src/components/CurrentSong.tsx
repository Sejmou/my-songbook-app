import { useCallback, useMemo, useRef } from 'react';
import { useCurrentSong, useSongStore } from '../store';
import CheckboxInput from './CheckboxInput';
import {
  Button,
  FlatList,
  ScrollView,
  Text,
  View,
  ViewToken,
  ViewabilityConfig,
  ViewabilityConfigCallbackPair,
} from 'react-native';
import { MainHeading, RegularText, SubHeading } from './typography';
import classNames from 'classnames';
import PageHeader from './PageHeader';
import MIDIScroll from './MIDIScroll';

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

  const firstVisibleLyricBlockIndex = useRef<number | null>(null);
  const lastVisibleLyricBlockIndex = useRef<number | null>(null);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      const visibleIndexes = viewableItems
        .map(el => el.index)
        .filter(i => !!i) as number[];
      const minVisibleIndex = Math.min(...visibleIndexes);
      const maxVisibleIndex = Math.max(...visibleIndexes);
      firstVisibleLyricBlockIndex.current = minVisibleIndex;
      lastVisibleLyricBlockIndex.current = maxVisibleIndex;
    },
    []
  );

  const viewabilityConfig = useMemo<ViewabilityConfig>(
    () => ({
      itemVisiblePercentThreshold: 50, // TODO: figure out appropriate value
      waitForInteraction: false,
    }),
    []
  );

  const viewabilityConfigCallbackPairs = useRef<
    ViewabilityConfigCallbackPair[]
  >([{ viewabilityConfig, onViewableItemsChanged }]);

  const flatListRef = useRef<FlatList>(null);

  const scrollNextInvisibleBlockIntoView = useCallback(() => {
    if (lastVisibleLyricBlockIndex.current === null) {
      return;
    }
    const nextBlockIndex = lastVisibleLyricBlockIndex.current + 1;
    if (nextBlockIndex >= lyricBlocks.length) {
      return;
    }
    flatListRef.current?.scrollToIndex({ index: nextBlockIndex });
  }, [lyricBlocks]);

  const scrollPreviousInvisibleBlockIntoView = useCallback(() => {
    if (firstVisibleLyricBlockIndex.current === null) {
      return;
    }
    const previousBlockIndex = firstVisibleLyricBlockIndex.current - 1;
    if (previousBlockIndex < 0) {
      return;
    }
    flatListRef.current?.scrollToIndex({ index: previousBlockIndex });
  }, [lyricBlocks]);

  const input = useSongStore(state => state.midiInput);

  return (
    <View className="flex h-full">
      <PageHeader>
        <View className="flex flex-col">
          <MainHeading>{currentSong.title || 'No Title'}</MainHeading>
          <SubHeading>
            by{' '}
            <Text className="font-semibold">
              {currentSong.artist || 'No Artist'}
            </Text>
          </SubHeading>
        </View>
      </PageHeader>
      <View className="mt-4 flex flex-row justify-between">
        <SectionHeadingsCheckbox />
        <View className="flex flex-row">
          <Button
            onPress={scrollPreviousInvisibleBlockIntoView}
            title="Next Section"
          />
          <Button
            onPress={scrollNextInvisibleBlockIntoView}
            title="Previous Section"
          />
        </View>
      </View>
      {viewabilityConfigCallbackPairs.current && (
        <FlatList
          className="flex flex-col mt-4 overflow-scroll flex-1 mb-4"
          data={lyricBlocks}
          ref={flatListRef}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          renderItem={({ item, index }) => {
            const block = item as LyricBlock;
            return (
              <View
                className={classNames(
                  { 'mt-8': index !== 0 && !showSectionHeadingsOnly },
                  { 'mt-4': index !== 0 && showSectionHeadingsOnly }
                )}
              >
                <RegularText additionalClassNames="font-bold">
                  {block.name}
                </RegularText>
                {!showSectionHeadingsOnly && (
                  <View>
                    {block.content.split('\n').map((line, i) => (
                      <RegularText key={i}>{line}</RegularText>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
          bounces={false}
        />
      )}
      {input && (
        <MIDIScroll
          input={input}
          onScrollUp={scrollPreviousInvisibleBlockIntoView}
          onScrollDown={scrollNextInvisibleBlockIntoView}
        />
      )}
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

type LyricBlock = {
  name: string;
  content: string;
};

function splitIntoBlocksBySectionHeading(lyrics: string): LyricBlock[] {
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
