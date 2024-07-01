import { Button } from "./button";

export interface SequencerData {
  steps: boolean[];
}

export const defaultSequencerData: SequencerData = {
  steps: Array(16).fill(false),
};

export class Sequencer extends Button {}
