import { GraphNode, Trigger } from "../util/graph";

export interface SequencerData {
  steps: boolean[];
}

export const defaultSequencerData: SequencerData = {
  steps: Array(16).fill(false),
};

export enum SequencerConnection {
  TriggerIn = "triggerIn",
  TriggerOut = "triggerOut",
}

export class SequencerGraphNode extends GraphNode<SequencerData> {
  constructor() {
    super();

    this.connectables.set(SequencerConnection.TriggerIn, new Trigger());
    this.connectables.set(SequencerConnection.TriggerOut, new Trigger());
  }
  public dispose(): void {}
  public update(_data: SequencerData): void {}
}

/**
 * UI and backend need to know pattern and currentStep
 * UI needs to be able to change the currentStep and pattern
 * Current step should be modifiable by backend --> basically, we need a way for the graph node to modify its data in the store
 * If it can, then we can have the triggerIn trigger a step that shows on the UI as well
 *
 *
 *
 * backend updating store:
 * - does zustand have a way to update the store without the usestore hook? maybe we can pass that into each graphnode so it has access
 */
