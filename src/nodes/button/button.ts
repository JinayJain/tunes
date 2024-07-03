import { GraphNode, Trigger } from "../util/graph";

export interface ButtonData {}

export const defaultButtonData: ButtonData = {};

export enum ButtonConnection {
  Trigger = "trigger",
}

export class ButtonGraphNode extends GraphNode<ButtonData> {
  constructor() {
    super();

    this.connectables.set(ButtonConnection.Trigger, new Trigger());
  }

  public dispose() {
    // TODO: dispose of trigger (?)
  }

  public update() {}

  public trigger(on: boolean) {
    const trigger = this.getConnectable(ButtonConnection.Trigger) as Trigger;
    trigger.trigger(on);
  }
}
