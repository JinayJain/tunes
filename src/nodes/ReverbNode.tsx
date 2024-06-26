import { useState, useRef, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function ReverbNode({ id, selected }: NodeProps) {
  const [decay, setDecay] = useState(1);
  const [preDelay, setPreDelay] = useState(0.01);
  const [wet, setWet] = useState(1);

  const reverb = useRef<Tone.Reverb | null>(null);
  if (reverb.current === null) {
    reverb.current = new Tone.Reverb({
      decay,
      preDelay,
      wet,
    });
  }

  const inputHandleId = useHandle(id, "input", reverb.current);
  const outputHandleId = useHandle(id, "output", reverb.current);

  useEffect(() => {
    if (reverb.current) {
      reverb.current.decay = decay;
      reverb.current.preDelay = preDelay;
      reverb.current.wet.value = wet;
    }
  }, [decay, preDelay, wet]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Reverb</h1>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <label className="text-xs">Decay:</label>
            <input
              type="number"
              className="nodrag border"
              value={decay}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setDecay(value);
                }
              }}
              step={0.1}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Pre Delay:</label>
            <input
              type="number"
              className="nodrag border"
              value={preDelay}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setPreDelay(value);
                }
              }}
              step={0.01}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Wet:</label>
            <input
              type="range"
              className="nodrag border"
              value={wet}
              onChange={(e) => setWet(parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.01}
            />
            <span className="text-xs min-w-[8ch]">{wet}</span>
          </div>
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default ReverbNode;
