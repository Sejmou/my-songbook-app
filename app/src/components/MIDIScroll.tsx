import { useMIDINote } from '../hooks/midi/use-midi-note';
import { MIDIInputWithListeners } from '../hooks/midi/midi-input';

// allows scrolling (or actually, with some code modifications, triggering arbitrary actions) via MIDI
const MIDIScroll = ({
  input,
  onScrollUp,
  onScrollDown,
}: {
  input: MIDIInputWithListeners;
  onScrollUp: () => void;
  onScrollDown: () => void;
}) => {
  const event = useMIDINote(input);
  if (!event) return <></>;
  const { on, note } = event;

  if (on && note === 3) {
    onScrollDown();
  } else if (on && note === 2) {
    onScrollUp();
  }
  return <></>;
};

export default MIDIScroll;
