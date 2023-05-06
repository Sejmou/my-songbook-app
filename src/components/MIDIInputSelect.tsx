import { useSongStore } from '../store';
import { Text, View } from 'react-native';
import SelectInput from './SelectInput';
import { useMIDI } from '../hooks/midi/use-midi';
import { useMIDINote } from '../hooks/midi/use-midi-note';
import { MIDIInputWithListeners } from '../hooks/midi/midi-input';
import { SubHeading } from './typography';

type Props = {
  className?: string;
};

const MIDIInputSelect = ({ className }: Props) => {
  const { inputs } = useMIDI();
  const midiInput = useSongStore(state => state.midiInput);
  const setMidiInput = useSongStore(state => state.setMidiInput);

  const handleSelectChange = (id: string) => {
    const selectedInput = inputs?.find(i => i.id === id);
    if (selectedInput) {
      setMidiInput(selectedInput);
    }
  };

  if (!inputs) {
    return (
      <View>
        <Text>
          No MIDI inputs available. Connect one to scroll through the page with
          it (send MIDI note 2 on any channel for scrolling up and MIDI note 3
          for scrolling down).
        </Text>
      </View>
    );
  }

  return (
    <View className={className}>
      <SubHeading>Select MIDI input</SubHeading>
      <Text className="mb-2">
        You can then scroll lyrics via MIDI - send note 2 on any channel for
        scroll up, note 3 for scroll down
      </Text>
      <SelectInput
        value={midiInput?.id}
        onValueChange={handleSelectChange}
        items={inputs.map(input => ({
          label: input.name,
          value: input.id,
        }))}
        label="Current input"
      />
      {midiInput && <MIDINoteLog input={midiInput} />}
    </View>
  );
};

const MIDINoteLog = ({ input }: { input: MIDIInputWithListeners }) => {
  const event = useMIDINote(input); // Intially returns undefined
  if (!event) {
    return <Text>Waiting for note...</Text>;
  }
  const { on, note, velocity, channel } = event;
  return (
    <View>
      <Text>
        Note {note} {on ? 'on' : 'off'} ({velocity}) on channel {channel}
      </Text>
    </View>
  );
};

export default MIDIInputSelect;
