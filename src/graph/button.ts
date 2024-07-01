import { GraphNode, Trigger } from ".";

export interface ButtonData {}

export const defaultButtonData: ButtonData = {};

export enum ButtonConnection {
  Trigger = "trigger",
}

export class Button extends GraphNode<ButtonData> {
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
