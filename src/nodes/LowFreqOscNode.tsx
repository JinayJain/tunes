import { useState, useRef, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function LowFreqOscNode({ id, selected }: NodeProps) {
  const [freq, setFreq] = useState(1);
  const [type, setType] = useState<Tone.ToneOscillatorType>("sine");
  const [minValue, setMinValue] = useState(0.1);
  const [maxValue, setMaxValue] = useState(10);

  const lfo = useRef<Tone.LFO | null>(null);
  if (lfo.current === null) {
    lfo.current = new Tone.LFO(freq, minValue, maxValue).start();
  }
  const outputHandleId = useHandle(id, "output", lfo.current);
  const frequencyHandleId = useHandle(id, "frequency", lfo.current.frequency);

  useEffect(() => {
    if (lfo.current) {
      lfo.current.frequency.value = freq;
      lfo.current.type = type;
      lfo.current.min = minValue;
      lfo.current.max = maxValue;
    }
  }, [freq, type, minValue, maxValue]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={frequencyHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">LFO</h1>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <label className="text-xs">Min Value:</label>
            <input
              type="number"
              className="nodrag border"
              value={minValue}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setMinValue(value);
                }
              }}
              step={0.1}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Max Value:</label>
            <input
              type="number"
              className="nodrag border"
              value={maxValue}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setMaxValue(value);
                }
              }}
              step={0.1}
            />
          </div>
          <div className="flex flex-col">
            <input
              type="range"
              className="nodrag border"
              value={freq}
              onChange={(e) => {
                setFreq(parseFloat(e.target.value));
              }}
              min={0.1}
              max={10}
              step={0.1}
            />
            <span className="text-xs">{freq} Hz</span>
          </div>
          <div className="flex flex-col">
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
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default LowFreqOscNode;
