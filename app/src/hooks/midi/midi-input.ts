import { MIDIInput, MIDIMessageEvent } from '@motiz88/react-native-midi';
import {
  ControlChangeMessage,
  NoteMessage,
  TransportClockMessage,
} from './types';

type MIDIMessageListeners = {
  noteOn: { [id: string]: (message: NoteMessage) => void };
  noteOff: { [id: string]: (message: NoteMessage) => void };
  controlChange: { [id: string]: (message: ControlChangeMessage) => void };
};

export class MIDIInputWithListeners {
  // TODO: implement this properly (proxy pattern?)

  constructor(input: MIDIInput) {
    input.onmidimessage = this.handleMIDIMessage.bind(this); // important to bind this, otherwise this will be undefined when calling handleMIDIMessage
    this.input = input;
  }

  private input: MIDIInput;

  public get id() {
    return this.input.id;
  }

  public get name() {
    return this.input.name;
  }

  // TODO: it is not particularly clean to allow changing this from outside the class
  public listeners: MIDIMessageListeners = {
    noteOn: {},
    noteOff: {},
    controlChange: {},
  };

  private handleNoteOn(message: NoteMessage) {
    for (const key in this.listeners.noteOn) {
      this.listeners.noteOn[key](message);
    }
  }

  private handleNoteOff(message: NoteMessage) {
    for (const key in this.listeners.noteOff) {
      this.listeners.noteOff[key](message);
    }
  }

  private handleControlChange(message: ControlChangeMessage) {
    for (const key in this.listeners.controlChange) {
      this.listeners.controlChange[key](message);
    }
  }

  private handleTransportClockMessage(message: TransportClockMessage) {
    console.warn('transport/clock message handling not implemented yet');
  }

  private handleMIDIMessage(message: MIDIMessageEvent) {
    const { actionName, leastSig, channel, data } = extractData(message);

    if (actionName == 'control change') {
      const message: ControlChangeMessage = {
        control: data[1],
        value: data[2],
        channel,
      };
      this.handleControlChange(message);
    } else if (actionName == 'transport/clock') {
      const message: TransportClockMessage = {
        type: data[0],
      };
      this.handleTransportClockMessage(message);
    } else if (actionName == 'unknown') {
      console.log(
        'cannot handle MIDI message, unknown action type, orignal MIDIMessageEvent:',
        message
      );
    } else {
      const message: NoteMessage = {
        note: data[1],
        velocity: data[2],
        channel,
      };
      if (actionName == 'note on') {
        this.handleNoteOn(message);
      } else if (actionName == 'note off') {
        this.handleNoteOff(message);
      }
    }
  }
}

function extractData(message: MIDIMessageEvent): {
  actionName: ActionNames;
  leastSig: number;
  channel: number;
  data: Uint8Array;
} {
  const action = message.data[0] & 0xf0; // Mask channel/least significant bits;
  const actionName = getActionName(action);

  const leastSig = message.data[0] & 0x0f; // Mask action bits;
  const channel = leastSig + 1;
  return {
    actionName,
    leastSig,
    channel,
    data: message.data,
  };
}

function getActionName(action: number) {
  switch (action) {
    case 0xb0:
      return 'control change';
    case 0x90:
      return 'note on';
    case 0x80:
      return 'note off';
    case 0xf0:
      return 'transport/clock';
    default:
      return 'unknown';
  }
}

type ActionNames = ReturnType<typeof getActionName>;
