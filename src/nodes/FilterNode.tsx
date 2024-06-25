import { useState, useRef, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function FilterNode({ id, selected }: NodeProps) {
  const [frequency, setFrequency] = useState(350);
  const [type, setType] = useState<BiquadFilterType>("lowpass");

  const filter = useRef<Tone.Filter | null>(null);
  if (!filter.current) {
    filter.current = new Tone.Filter(frequency, type);
  }

  const inputHandleId = useHandle(id, "input", filter.current);
  const outputHandleId = useHandle(id, "output", filter.current);

  useEffect(() => {
    if (filter.current) {
      filter.current.frequency.value = frequency;
      filter.current.type = type;
    }
  }, [frequency, type]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Filter</h1>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Frequency:</label>
          <input
            type="range"
            className="nodrag border"
            value={frequency}
            onChange={(e) => {
              setFrequency(parseInt(e.target.value));
            }}
            min={20}
            max={20000}
          />
          <span className="text-xs min-w-[8ch]">{frequency} Hz</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Type:</label>
          <select
            className="nodrag border"
            value={type}
            onChange={(e) => {
              setType(e.target.value as BiquadFilterType);
            }}
          >
            {[
              "lowpass",
              "highpass",
              "bandpass",
              "lowshelf",
              "highshelf",
              "notch",
              "allpass",
              "peaking",
            ].map((type) => (
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

export default FilterNode;
