import * as Tone from "tone";
import { GraphNode } from "../util/graph";

export enum ReverbConnection {
  Input = "input",
  Output = "output",
}

export interface ReverbData {
  decay: number;
  preDelay: number;
  wet: number;
}

export const defaultReverbData: ReverbData = {
  decay: 1.5,
  preDelay: 0.01,
  wet: 1,
};

export class ReverbGraphNode extends GraphNode<ReverbData> {
  private reverb: Tone.Reverb;

  constructor(data: ReverbData) {
    super();

    this.reverb = new Tone.Reverb({
      decay: data.decay,
      preDelay: data.preDelay,
      wet: data.wet,
    });

    this.connectables.set(ReverbConnection.Input, this.reverb);
    this.connectables.set(ReverbConnection.Output, this.reverb);
  }

  public dispose() {
    this.reverb.dispose();
  }

  public update(data: ReverbData) {
    this.reverb.decay = data.decay;
    this.reverb.preDelay = data.preDelay;
    this.reverb.wet.value = data.wet;
  }
}
