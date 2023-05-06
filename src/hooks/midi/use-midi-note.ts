import { useState, useEffect } from 'react';
import { MIDIFilter, MIDINote, NoteMessage } from './types';
import { MIDIInputWithListeners } from './midi-input';

export const useMIDINote = (
  input: MIDIInputWithListeners,
  { target: noteFilter, channel: channelFilter }: MIDIFilter = {}
) => {
  const [value, setValue] = useState<MIDINote | undefined>();
  const handleNoteOnMessage = (message: NoteMessage) => {
    const { note, velocity, channel } = message;
    if (
      (!noteFilter || noteFilter === note) &&
      (!channelFilter || channelFilter === channel)
    ) {
      setValue({ note, on: true, velocity, channel });
    }
  };
  const handleNoteOffMessage = (message: NoteMessage) => {
    const { note, velocity, channel } = message;
    if (
      (!noteFilter || noteFilter === note) &&
      (!channelFilter || channelFilter === channel)
    ) {
      setValue({ note, on: false, velocity, channel });
    }
  };
  useEffect(() => {
    if (!input) return;
    const id = randomId();
    input.listeners.noteOn[id] = handleNoteOnMessage;
    input.listeners.noteOff[id] = handleNoteOffMessage;
    return () => {
      delete input.listeners.noteOn[id];
      delete input.listeners.noteOff[id];
    };
  }, [input]);
  return value;
};

function randomId() {
  return Math.random().toString(36).substring(7);
}
