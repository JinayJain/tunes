import { useState, useRef, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function GainNode({ id, selected }: NodeProps) {
  const [gain, setGain] = useState(1);

  const gainNode = useRef<Tone.Gain | null>(null);
  if (gainNode.current === null) {
    gainNode.current = new Tone.Gain(gain);
  }

  const inputHandleId = useHandle(id, "input", gainNode.current);
  const outputHandleId = useHandle(id, "output", gainNode.current);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = gain;
    }
  }, [gain]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Gain</h1>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Gain:</label>
          <input
            type="range"
            className="nodrag border"
            value={gain}
            onChange={(e) => setGain(parseFloat(e.target.value))}
            min={0}
            max={2}
            step={0.01}
          />
          <span className="text-xs min-w-[8ch]">{gain}</span>
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default GainNode;
