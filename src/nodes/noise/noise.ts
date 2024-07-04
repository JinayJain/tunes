import * as Tone from "tone";
import { GraphNode } from "../util/graph";

export enum NoiseConnection {
  Output = "output",
}

export interface NoiseData {
  type: Tone.NoiseType;
}

export const defaultNoiseData: NoiseData = {
  type: "white",
};

export class NoiseGraphNode extends GraphNode<NoiseData> {
  private noise: Tone.Noise;

  constructor(data: NoiseData) {
    super();

    this.noise = new Tone.Noise(data.type);
    this.noise.start();

    this.connectables.set(NoiseConnection.Output, this.noise);
  }

  public dispose() {
    this.noise.dispose();
  }

  public update(data: NoiseData) {
    this.noise.type = data.type;
  }
}
