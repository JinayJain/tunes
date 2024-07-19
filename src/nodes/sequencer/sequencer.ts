import { useStore } from "@/store";
import { GraphNode, Trigger } from "../util/graph";

export interface SequencerData {
  steps: boolean[];
  currentStep: number;
}

export const defaultSequencerData: SequencerData = {
  steps: Array(16).fill(false),
  currentStep: 0,
};

export enum SequencerConnection {
  TriggerIn = "triggerIn",
  TriggerOut = "triggerOut",
}

export class SequencerGraphNode extends GraphNode<SequencerData> {
  private currentStep: number;
  private pattern: boolean[];

  constructor(id: string, data: SequencerData) {
    super(id);

    this.pattern = data.steps;
    this.currentStep = data.currentStep;

    this.connectables.set(
      SequencerConnection.TriggerIn,
      new Trigger((on) => on && this.step())
    );
    this.connectables.set(SequencerConnection.TriggerOut, new Trigger());
  }

  public dispose(): void {}

  public update(data: SequencerData): void {
    this.pattern = data.steps;

    if (this.currentStep !== data.currentStep) {
      const triggerOut = this.getConnectable(
        SequencerConnection.TriggerOut
      ) as Trigger;

      triggerOut.trigger(this.pattern[this.currentStep]);
      triggerOut.trigger(this.pattern[data.currentStep]);

      this.currentStep = data.currentStep;
    }
  }

  private step() {
    const nextStep = (this.currentStep + 1) % this.pattern.length;

    useStore.getState().updateNodeData(this.id, {
      steps: this.pattern,
      currentStep: nextStep,
    });
  }
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
