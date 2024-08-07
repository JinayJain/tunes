import * as Tone from "tone";
import { GraphNode } from "../util/graph";

export interface SinkData {
  volume: number;
}

export const defaultSinkData: SinkData = {
  volume: -Infinity,
};

export enum SinkConnection {
  AudioIn = "audioIn",
}

export class SinkGraphNode extends GraphNode<SinkData> {
  private destination: Tone.ToneAudioNode;
  private volume: Tone.Volume;

  constructor(id: string, data: SinkData) {
    super(id);

    this.destination = Tone.getDestination();
    this.volume = new Tone.Volume(data.volume);
    this.volume.connect(this.destination);

    this.connectables.set(SinkConnection.AudioIn, this.volume);
  }

  public dispose() {
    this.volume.dispose();
  }

  public update(data: SinkData) {
    this.volume.volume.value = data.volume;
  }
}
