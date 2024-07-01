import * as Tone from "tone";

export class Trigger {
  private _callback: (data: boolean) => void = () => {};
  private _listeners: Array<Trigger> = [];

  constructor(callback?: (data: boolean) => void) {
    if (callback) {
      this._callback = callback;
    }
  }

  public connect(trigger: Trigger) {
    this._listeners.push(trigger);
  }

  public disconnect(trigger: Trigger) {
    this._listeners = this._listeners.filter(
      (listener) => listener !== trigger
    );
  }

  public trigger(data: boolean) {
    this._callback(data);
    this._listeners.forEach((listener) => listener.trigger(data));
  }
}

export type Connectable = Tone.ToneAudioNode | Trigger;

export const connect = (source: Connectable, target: Connectable) => {
  if (source instanceof Trigger && target instanceof Trigger) {
    source.connect(target);
  } else if (
    source instanceof Tone.ToneAudioNode &&
    target instanceof Tone.ToneAudioNode
  ) {
    source.connect(target);
  } else {
    console.error("Unable to connect", source, target);
  }
};

export const disconnect = (source: Connectable, target: Connectable) => {
  if (source instanceof Trigger && target instanceof Trigger) {
    source.disconnect(target);
  } else if (
    source instanceof Tone.ToneAudioNode &&
    target instanceof Tone.ToneAudioNode
  ) {
    source.disconnect(target);
  } else {
    console.error("Unable to disconnect", source, target);
  }
};

export abstract class GraphNode<T> {
  protected connectables: Map<string, Connectable> = new Map();

  public abstract dispose(): void;
  public abstract update(data: T): void;
  public getConnectable(id: string): Connectable | undefined {
    return this.connectables.get(id);
  }
}
