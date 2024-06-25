import { useState, useRef, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function NoiseNode({ id, selected }: NodeProps) {
  const [type, setType] = useState<Tone.NoiseType>("white");

  const noise = useRef<Tone.Noise | null>(null);
  if (noise.current === null) {
    noise.current = new Tone.Noise(type).start();
  }
  const outputHandleId = useHandle(id, "output", noise.current);

  useEffect(() => {
    if (noise.current) {
      noise.current.type = type;
    }
  }, [type]);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Noise</h1>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Type:</label>
          <select
            className="nodrag border"
            value={type}
            onChange={(e) => {
              setType(e.target.value as Tone.NoiseType);
            }}
          >
            {["white", "pink", "brown"].map((type) => (
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

export default NoiseNode;
