import * as Tone from "tone";
import { GraphNode, Trigger } from ".";

export type EnvelopeData = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export const defaultEnvelopeData: EnvelopeData = {
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 1.5,
};

export enum EnvelopeConnection {
  AudioIn = "audioIn",
  AudioOut = "audioOut",
  Trigger = "trigger",
}

export class EnvelopeGraphNode extends GraphNode<EnvelopeData> {
  private envelope: Tone.AmplitudeEnvelope;

  constructor(data: EnvelopeData) {
    super();
    this.envelope = new Tone.AmplitudeEnvelope(data);

    this.connectables.set(EnvelopeConnection.AudioIn, this.envelope.input);
    this.connectables.set(EnvelopeConnection.AudioOut, this.envelope.output);
    this.connectables.set(
      EnvelopeConnection.Trigger,
      new Trigger((on) => this.trigger(on))
    );
  }

  public dispose() {
    this.envelope.dispose();
  }

  public update(data: EnvelopeData) {
    this.envelope.attack = data.attack;
    this.envelope.decay = data.decay;
    this.envelope.sustain = data.sustain;
    this.envelope.release = data.release;
  }

  public trigger(on: boolean) {
    if (on) {
      this.envelope.triggerAttack();
    } else {
      this.envelope.triggerRelease();
    }
  }
}
