import { GraphNode } from "../util/graph";
import * as Tone from "tone";

export interface MicrophoneData {}

export const defaultMicrophoneData: MicrophoneData = {};

export enum MicrophoneConnection {
  AudioOut = "audioOut",
}

export class MicrophoneGraphNode extends GraphNode<MicrophoneData> {
  private microphone: Tone.UserMedia;

  constructor(id: string) {
    super(id);
    this.microphone = new Tone.UserMedia();
    this.microphone.open();

    this.connectables.set(MicrophoneConnection.AudioOut, this.microphone);
  }

  public dispose() {
    this.microphone.dispose();
  }

  public update() {}
}
