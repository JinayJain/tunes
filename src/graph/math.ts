import * as Tone from "tone";
import { GraphNode } from ".";

export enum MathOperation {
  Add = "add",
  Subtract = "subtract",
  Multiply = "multiply",
}

export interface MathData {
  operation: MathOperation;
  operand1Value: number;
  operand2Value: number;
}

export const defaultMathData: MathData = {
  operation: MathOperation.Add,
  operand1Value: 0,
  operand2Value: 0,
};

export enum MathConnection {
  Operand1 = "operand1",
  Operand2 = "operand2",
  Output = "output",
}

export class MathGraphNode extends GraphNode<MathData> {
  private operand1: Tone.Signal;
  private operand2: Tone.Signal;
  private output: Tone.Signal;
  private operator: Tone.ToneAudioNode;

  private adder = new Tone.Add();
  private subtractor = new Tone.Subtract();
  private multiplier = new Tone.Multiply();

  constructor(data: MathData) {
    super();

    this.operand1 = new Tone.Signal(data.operand1Value);
    this.operand2 = new Tone.Signal(data.operand2Value);

    this.output = new Tone.Signal();

    this.connectables.set(MathConnection.Operand1, this.operand1);
    this.connectables.set(MathConnection.Operand2, this.operand2);
    this.connectables.set(MathConnection.Output, this.output);

    this.operand1.connect(this.adder);
    this.operand2.connect(this.adder.addend);

    this.operand1.connect(this.subtractor);
    this.operand2.connect(this.subtractor.subtrahend);

    this.operand1.connect(this.multiplier);
    this.operand2.connect(this.multiplier.factor);

    this.operator = this.getOperation(data.operation);
    this.operator.connect(this.output);
  }

  public dispose() {
    this.operand1.dispose();
    this.operand2.dispose();
  }

  private getOperation(operation: MathOperation): Tone.ToneAudioNode {
    switch (operation) {
      case MathOperation.Add:
        return this.adder;
      case MathOperation.Subtract:
        return this.subtractor;
      case MathOperation.Multiply:
        return this.multiplier;
    }

    throw new Error("Unsupported operation");
  }

  public update(data: MathData): void {
    this.operand1.value = data.operand1Value;
    this.operand2.value = data.operand2Value;

    const newOperator = this.getOperation(data.operation);
    if (newOperator !== this.operator) {
      this.operator.disconnect(this.output);
      this.operator = newOperator;
      this.operator.connect(this.output);
    }
  }
}
