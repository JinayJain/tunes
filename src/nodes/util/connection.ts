import * as Tone from "tone";

export type Connectable = Tone.ToneAudioNode | Trigger;

export class Trigger {
  private _callback: (on: boolean) => void = () => {};
  private _listeners: Array<Trigger> = [];

  constructor(callback?: (on: boolean) => void) {
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

  public trigger(on: boolean) {
    this._callback(on);
    this._listeners.forEach((listener) => listener.trigger(on));
  }
}
