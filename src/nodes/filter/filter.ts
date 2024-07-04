import * as Tone from "tone";
import { GraphNode } from "../util/graph";

export enum FilterConnection {
  Input = "input",
  Output = "output",
}

export interface FilterData {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
}

export const defaultFilterData: FilterData = {
  type: "lowpass",
  frequency: 350,
  Q: 1,
};

export class FilterGraphNode extends GraphNode<FilterData> {
  private filter: Tone.Filter;

  constructor(data: FilterData) {
    super();

    this.filter = new Tone.Filter({
      type: data.type,
      frequency: data.frequency,
      Q: data.Q,
    });

    this.connectables.set(FilterConnection.Input, this.filter);
    this.connectables.set(FilterConnection.Output, this.filter);
  }

  public dispose() {
    this.filter.dispose();
  }

  public update(data: FilterData) {
    this.filter.type = data.type;
    this.filter.frequency.value = data.frequency;
    this.filter.Q.value = data.Q;
  }
}
