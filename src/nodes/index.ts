import ButtonNode from "./ButtonNode";
import EnvelopeNode from "./EnvelopeNode";
import FilterNode from "./FilterNode";
import GainNode from "./GainNode";
import NoiseNode from "./NoiseNode";
import OscNode from "./OscNode";
import SequencerNode from "./SequencerNode";
import SinkNode from "./SinkNode";

export const nodeTypes = {
  oscillator: OscNode,
  envelope: EnvelopeNode,
  sink: SinkNode,
  filter: FilterNode,
  sequencer: SequencerNode,
  button: ButtonNode,
  noise: NoiseNode,
  gain: GainNode,
};
