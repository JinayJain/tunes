import ButtonNode from "./ButtonNode";
import EnvelopeNode from "./EnvelopeNode";
import FilterNode from "./FilterNode";
import GainNode from "./GainNode";
import LowFreqOscNode from "./LowFreqOscNode";
import NoiseNode from "./NoiseNode";
import OscNode from "./OscNode";
import PianoNode from "./PianoNode";
import ReverbNode from "./ReverbNode";
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
  lfo: LowFreqOscNode,
  piano: PianoNode,
  reverb: ReverbNode,
};
