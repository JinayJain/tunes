import { GraphNode, Trigger } from "../util/graph";

export interface ClockData {
  frequency: number;
}

export const defaultClockData: ClockData = {
  frequency: 1.0,
};

export enum ClockConnection {
  Trigger = "trigger",
}

export class ClockGraphNode extends GraphNode<ClockData> {
  constructor(id: string) {
    super(id);

    this.connectables.set(ClockConnection.Trigger, new Trigger());
  }

  public dispose(): void {}
  public update(_data: ClockData): void {}

  public trigger(on: boolean) {
    const trigger = this.getConnectable(ClockConnection.Trigger) as Trigger;
    trigger.trigger(on);
  }
}
