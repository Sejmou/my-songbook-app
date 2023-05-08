// The code for this file and other files in this directory was adapted from https://github.com/nickroberts404/react-midi-hooks

import { useState, useEffect } from 'react';
import {
  MIDIAccess,
  MIDIInput,
  MIDIOutput,
  MIDIOutput as Output,
  requestMIDIAccess,
} from '@motiz88/react-native-midi';
import { MIDIInputWithListeners } from './midi-input';

type Connections = {
  inputs: MIDIInputWithListeners[];
  outputs: Output[];
};

const defaultConnections: Connections = { inputs: [], outputs: [] };

export const useMIDI = () => {
  const [connections, setConnections] =
    useState<Connections>(defaultConnections);
  useEffect(() => {
    requestMIDIAccess().then(access => {
      // note: I don't quite understand the difference between MIDIAccess and globalThis.MIDIAccess, but in  any case a type cast is necessary as otherwise TS complains
      const { inputs, outputs } = getInputsAndOutputs(
        access as unknown as MIDIAccess
      );
      setConnections({
        inputs,
        outputs,
      });
      access.onstatechange = () => {
        const inputs = Array.from(
          (access.inputs as any).values()
        ) as MIDIInput[];
        const inputsWithListeners = inputs.map(
          input => new MIDIInputWithListeners(input)
        );
        const outputs = Array.from(
          (access.outputs as any).values()
        ) as MIDIOutput[];
        setConnections({
          inputs: inputsWithListeners,
          outputs,
        });
      };
    });
  }, []);
  return {
    inputs: connections.inputs,
    outputs: connections.outputs,
  };
};

function getInputsAndOutputs(access: MIDIAccess) {
  const inputs = Array.from(access.inputs.values());
  const inputsWithListeners = inputs.map(
    input => new MIDIInputWithListeners(input)
  );
  const outputs = Array.from(access.outputs.values());

  return {
    inputs: inputsWithListeners,
    outputs,
  };
}
