import { ButtonGraphNode } from "../button/button";

export interface SequencerData {
  steps: boolean[];
}

export const defaultSequencerData: SequencerData = {
  steps: Array(16).fill(false),
};

export class SequencerGraphNode extends ButtonGraphNode {}
