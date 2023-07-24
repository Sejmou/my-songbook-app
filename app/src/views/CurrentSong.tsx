import { useCallback, useMemo, useRef } from 'react';
import { useCurrentSong, useSongStore } from '../store/songs';
import CheckboxInput from '../components/CheckboxInput';
import {
  FlatList,
  Text,
  View,
  ViewToken,
  ViewabilityConfig,
  ViewabilityConfigCallbackPair,
} from 'react-native';
import { MainHeading, RegularText, SubHeading } from '../components/typography';
import classNames from 'classnames';
import PageHeader from '../components/PageHeader';
import MIDIScroll from '../components/MIDIScroll';
import IconButton from '../components/IconButton';

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
    const nextBlockIndex = lastVisibleLyricBlockIndex.current; // don't really understand why + 1 is not needed here
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
          <IconButton
            iconName="arrow-down"
            onPress={scrollNextInvisibleBlockIntoView}
          />
          <IconButton
            iconName="arrow-up"
            onPress={scrollPreviousInvisibleBlockIntoView}
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
                    {block.lines.map((line, i) => (
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
  lines: string[];
};

function splitIntoBlocksBySectionHeading(lyrics: string): LyricBlock[] {
  // example section heading: [Verse 1]
  const lines = lyrics.split('\n');
  const blocks: LyricBlock[] = [];

  let currentBlock: LyricBlock | null = null;

  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      if (currentBlock) {
        // push previous block contents to array
        blocks.push(currentBlock);
      }
      currentBlock = { name: line.substring(1, line.length - 1), lines: [] };
    } else {
      if (currentBlock) {
        currentBlock.lines.push(line);
      } else {
        // discovered line without section heading
        currentBlock = { name: '', lines: [line] };
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  for (const block of blocks) {
    block.lines = block.lines.filter(line => line.trim() !== '');
  }

  return blocks;
}
