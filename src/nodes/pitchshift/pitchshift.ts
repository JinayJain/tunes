import { GraphNode } from "../util/graph";
import * as Tone from "tone";

export interface PitchShiftData {
  pitch: number;
}

export const defaultPitchShiftData: PitchShiftData = {
  pitch: 0,
};

export class PitchShiftGraphNode extends GraphNode<PitchShiftData> {
  private pitchShift: Tone.PitchShift;

  constructor(id: string, data: PitchShiftData) {
    super(id);

    this.pitchShift = new Tone.PitchShift(data.pitch);

    this.connectables.set("input", this.pitchShift);
    this.connectables.set("output", this.pitchShift);
  }

  public dispose() {
    this.pitchShift.dispose();
  }

  public update(data: PitchShiftData) {
    this.pitchShift.pitch = data.pitch;
  }
}
