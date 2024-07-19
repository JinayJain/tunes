import { GraphNode } from "../util/graph";

export interface MixerData {}

export const defaultMixerData: MixerData = {};

export class MixerGraphNode extends GraphNode<MixerData> {
  constructor(id: string, data: MixerData) {
    super(id);
  }

  public dispose() {}
  public update(data: MixerData) {}
}