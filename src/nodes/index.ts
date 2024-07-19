import { NodeProps } from "reactflow";
import { ButtonGraphNode } from "./button/button";
import {
  defaultEnvelopeData,
  EnvelopeGraphNode,
  EnvelopeData,
} from "./envelope/envelope";
import { defaultMathData, MathGraphNode, MathData } from "./math/math";
import {
  defaultOscillatorData,
  OscillatorGraphNode,
  OscillatorData,
  defaultLfoData,
} from "./oscillator/oscillator";
import {
  defaultSequencerData,
  SequencerData,
  SequencerGraphNode,
} from "./sequencer/sequencer";
import { defaultSinkData, SinkGraphNode, SinkData } from "./sink/sink";
import { GraphNode } from "./util/graph";
import ButtonNode from "./button/ButtonNode";
import EnvelopeNode from "./envelope/EnvelopeNode";
import LFONode from "./lfo/LFONode";
import MathNode from "./math/MathNode";
import SequencerNode from "./sequencer/SequencerNode";
import SinkNode from "./sink/SinkNode";
import OscillatorNode from "./oscillator/OscillatorNode";
import { NoiseData, NoiseGraphNode, defaultNoiseData } from "./noise/noise";
import NoiseNode from "./noise/NoiseNode";
import FilterNode from "./filter/FilterNode";
import {
  FilterData,
  FilterGraphNode,
  defaultFilterData,
} from "./filter/filter";
import ReverbNode from "./reverb/ReverbNode";
import {
  ReverbData,
  ReverbGraphNode,
  defaultReverbData,
} from "./reverb/reverb";
import MicrophoneNode from "./microphone/MicrophoneNode";
import {
  MicrophoneGraphNode,
  defaultMicrophoneData,
} from "./microphone/microphone";
import ClockNode from "./clock/ClockNode";
import { ClockGraphNode, defaultClockData } from "./clock/clock";

export enum NodeType {
  Oscillator = "oscillator",
  Sink = "sink",
  Envelope = "envelope",
  Button = "button",
  Sequencer = "sequencer",
  LFO = "lfo",
  Math = "math",
  Noise = "noise",
  Filter = "filter",
  Reverb = "reverb",
  Microphone = "microphone",
  Clock = "clock",
}

type NodeInfo = {
  type: NodeType;
  label: string;
  defaultData: unknown;
  createGraphNode: (id: string, data: unknown) => GraphNode<unknown>;
};

export const NODE_DEFINITIONS: Record<NodeType, NodeInfo> = {
  [NodeType.Oscillator]: {
    type: NodeType.Oscillator,
    label: "Oscillator",
    defaultData: defaultOscillatorData,
    createGraphNode: (id, data) =>
      new OscillatorGraphNode(id, data as OscillatorData),
  },
  [NodeType.Sink]: {
    type: NodeType.Sink,
    label: "Speaker",
    defaultData: defaultSinkData,
    createGraphNode: (id, data) => new SinkGraphNode(id, data as SinkData),
  },
  [NodeType.Envelope]: {
    type: NodeType.Envelope,
    label: "Envelope",
    defaultData: defaultEnvelopeData,
    createGraphNode: (id, data) =>
      new EnvelopeGraphNode(id, data as EnvelopeData),
  },
  [NodeType.Button]: {
    type: NodeType.Button,
    label: "Button",
    defaultData: {},
    createGraphNode: (id) => new ButtonGraphNode(id),
  },
  [NodeType.Sequencer]: {
    type: NodeType.Sequencer,
    label: "Sequencer",
    defaultData: defaultSequencerData,
    createGraphNode: (id, data) =>
      new SequencerGraphNode(id, data as SequencerData),
  },
  [NodeType.LFO]: {
    type: NodeType.LFO,
    label: "LFO",
    defaultData: defaultLfoData,
    createGraphNode: (id, data) =>
      new OscillatorGraphNode(id, data as OscillatorData),
  },
  [NodeType.Math]: {
    type: NodeType.Math,
    label: "Math",
    defaultData: defaultMathData,
    createGraphNode: (id, data) => new MathGraphNode(id, data as MathData),
  },
  [NodeType.Noise]: {
    type: NodeType.Noise,
    label: "Noise",
    defaultData: defaultNoiseData,
    createGraphNode: (id, data) => new NoiseGraphNode(id, data as NoiseData),
  },
  [NodeType.Filter]: {
    type: NodeType.Filter,
    label: "Filter",
    defaultData: defaultFilterData,
    createGraphNode: (id, data) => new FilterGraphNode(id, data as FilterData),
  },
  [NodeType.Reverb]: {
    type: NodeType.Reverb,
    label: "Reverb",
    defaultData: defaultReverbData,
    createGraphNode: (id, data) => new ReverbGraphNode(id, data as ReverbData),
  },
  [NodeType.Microphone]: {
    type: NodeType.Microphone,
    label: "Microphone",
    defaultData: defaultMicrophoneData,
    createGraphNode: (id) => new MicrophoneGraphNode(id),
  },
  [NodeType.Clock]: {
    type: NodeType.Clock,
    label: "Clock",
    defaultData: defaultClockData,
    createGraphNode: (id) => new ClockGraphNode(id),
  },
};

export const NODE_TYPES: Record<NodeType, React.ComponentType<NodeProps>> = {
  [NodeType.Sink]: SinkNode,
  [NodeType.Envelope]: EnvelopeNode,
  [NodeType.Button]: ButtonNode,
  [NodeType.Oscillator]: OscillatorNode,
  [NodeType.Sequencer]: SequencerNode,
  [NodeType.LFO]: LFONode,
  [NodeType.Math]: MathNode,
  [NodeType.Noise]: NoiseNode,
  [NodeType.Filter]: FilterNode,
  [NodeType.Reverb]: ReverbNode,
  [NodeType.Microphone]: MicrophoneNode,
  [NodeType.Clock]: ClockNode,
};
