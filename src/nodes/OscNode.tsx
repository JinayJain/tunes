import { useState, useRef, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function OscNode({ id, selected }: NodeProps) {
  const [freq, setFreq] = useState(440);
  const [type, setType] = useState<Tone.ToneOscillatorType>("sine");

  const synth = useRef<Tone.Oscillator | null>(null);
  if (synth.current === null) {
    synth.current = new Tone.Oscillator(freq, type).start();
  }
  const outputHandleId = useHandle(id, "output", synth.current);
  const frequencyHandleId = useHandle(id, "frequency", synth.current.frequency);

  useEffect(() => {
    if (synth.current) {
      synth.current.frequency.value = freq;
      synth.current.type = type;
    }
  }, [freq, type]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={frequencyHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Oscillator</h1>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            className="nodrag border"
            value={freq}
            onChange={(e) => {
              setFreq(parseInt(e.target.value));
            }}
            min={20}
            max={5000}
          />
          <span className="text-xs min-w-[8ch]">{freq} Hz</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Type:</label>
          <select
            className="nodrag border"
            value={type}
            onChange={(e) => {
              setType(e.target.value as Tone.ToneOscillatorType);
            }}
          >
            {["sine", "square", "triangle", "sawtooth"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default OscNode;
