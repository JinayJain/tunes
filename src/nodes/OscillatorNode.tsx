import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "./util/Node";
import useHandle from "./util/useHandle";
import { useStore } from "../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { OscillatorData, OscillatorConnection } from "../graph/oscillator";

function OscillatorNode({
  id,
  selected,
  data: { frequency, type },
}: NodeProps<OscillatorData>) {
  const outputHandleId = useHandle(id, OscillatorConnection.AudioOut);
  const frequencyHandleId = useHandle(id, OscillatorConnection.Frequency);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<OscillatorData>)
  );

  const onFrequencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        updateNodeData(id, { frequency: value });
      }
    },
    [id, updateNodeData]
  );

  const onTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { type: e.target.value as OscillatorData["type"] });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <Handle type="target" position={Position.Left} id={frequencyHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Oscillator</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="range"
                className="nodrag border flex-1"
                value={frequency}
                onChange={onFrequencyChange}
                min={20}
                max={5000}
              />

              <input
                type="number"
                className="nodrag border"
                value={frequency}
                onChange={onFrequencyChange}
                min={20}
                max={5000}
              />
              <span>Hz</span>
            </div>
            <div className="flex items-center space-x-2">
              <label>Type:</label>
              <select
                className="nodrag border flex-1"
                value={type}
                onChange={onTypeChange}
              >
                {["sine", "square", "triangle", "sawtooth"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </NodeBody>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default OscillatorNode;
