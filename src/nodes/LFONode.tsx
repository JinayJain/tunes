import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "./util/Node";
import useHandle from "./util/useHandle";
import { useStore } from "../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { OscillatorData, OscillatorConnection } from "../graph/oscillator";

function LFONode({
  id,
  selected,
  data: { frequency },
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

  return (
    <>
      <Handle type="target" position={Position.Left} id={frequencyHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>LFO</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="range"
                className="nodrag border flex-1"
                value={frequency}
                onChange={onFrequencyChange}
                min={0.1}
                max={20}
                step={0.1}
              />
              <input
                type="number"
                className="nodrag border"
                value={frequency}
                onChange={onFrequencyChange}
                min={0.1}
                max={20}
                step={0.1}
              />
              <span>Hz</span>
            </div>
          </div>
        </NodeBody>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default LFONode;
