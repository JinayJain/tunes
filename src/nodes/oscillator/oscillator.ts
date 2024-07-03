import * as Tone from "tone";
import { GraphNode } from "../util/graph";

export interface OscillatorData {
  type: Tone.ToneOscillatorType;
  frequency: number;
}

export const defaultOscillatorData: OscillatorData = {
  type: "sine",
  frequency: 440,
};

export const defaultLfoData: OscillatorData = {
  type: "sine",
  frequency: 1,
};

export enum OscillatorConnection {
  AudioOut = "audioOut",
  Frequency = "frequency",
}

export class OscillatorGraphNode extends GraphNode<OscillatorData> {
  private oscillator: Tone.Oscillator;

  constructor(data: OscillatorData) {
    super();
    this.oscillator = new Tone.Oscillator(data.frequency, data.type).start();

    this.connectables.set(OscillatorConnection.AudioOut, this.oscillator);
    this.connectables.set(
      OscillatorConnection.Frequency,
      this.oscillator.frequency
    );
  }

  public dispose() {
    this.oscillator.dispose();
  }

  public update(data: OscillatorData) {
    this.oscillator.type = data.type;
    this.oscillator.frequency.value = data.frequency;
  }
}
