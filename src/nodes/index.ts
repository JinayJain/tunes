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
  createGraphNode: (data: unknown) => GraphNode<unknown>;
};

export const NODE_DEFINITIONS: Record<NodeType, NodeInfo> = {
  [NodeType.Oscillator]: {
    type: NodeType.Oscillator,
    label: "Oscillator",
    defaultData: defaultOscillatorData,
    createGraphNode: (data) => new OscillatorGraphNode(data as OscillatorData),
  },
  [NodeType.Sink]: {
    type: NodeType.Sink,
    label: "Speaker",
    defaultData: defaultSinkData,
    createGraphNode: (data) => new SinkGraphNode(data as SinkData),
  },
  [NodeType.Envelope]: {
    type: NodeType.Envelope,
    label: "Envelope",
    defaultData: defaultEnvelopeData,
    createGraphNode: (data) => new EnvelopeGraphNode(data as EnvelopeData),
  },
  [NodeType.Button]: {
    type: NodeType.Button,
    label: "Button",
    defaultData: {},
    createGraphNode: () => new ButtonGraphNode(),
  },
  [NodeType.Sequencer]: {
    type: NodeType.Sequencer,
    label: "Sequencer",
    defaultData: defaultSequencerData,
    createGraphNode: () => new SequencerGraphNode(),
  },
  [NodeType.LFO]: {
    type: NodeType.LFO,
    label: "LFO",
    defaultData: defaultLfoData,
    createGraphNode: (data) => new OscillatorGraphNode(data as OscillatorData),
  },
  [NodeType.Math]: {
    type: NodeType.Math,
    label: "Math",
    defaultData: defaultMathData,
    createGraphNode: (data) => new MathGraphNode(data as MathData),
  },
  [NodeType.Noise]: {
    type: NodeType.Noise,
    label: "Noise",
    defaultData: defaultNoiseData,
    createGraphNode: (data) => new NoiseGraphNode(data as NoiseData),
  },
  [NodeType.Filter]: {
    type: NodeType.Filter,
    label: "Filter",
    defaultData: defaultFilterData,
    createGraphNode: (data) => new FilterGraphNode(data as FilterData),
  },
  [NodeType.Reverb]: {
    type: NodeType.Reverb,
    label: "Reverb",
    defaultData: defaultReverbData,
    createGraphNode: (data) => new ReverbGraphNode(data as ReverbData),
  },
  [NodeType.Microphone]: {
    type: NodeType.Microphone,
    label: "Microphone",
    defaultData: defaultMicrophoneData,
    createGraphNode: () => new MicrophoneGraphNode(),
  },
  [NodeType.Clock]: {
    type: NodeType.Clock,
    label: "Clock",
    defaultData: defaultClockData,
    createGraphNode: () => new ClockGraphNode(),
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
