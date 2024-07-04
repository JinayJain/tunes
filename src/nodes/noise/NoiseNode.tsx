import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { NoiseData, NoiseConnection } from "./noise";
import React from "react";

function NoiseNode({ id, selected, data: { type } }: NodeProps<NoiseData>) {
  const outputHandleId = useHandle(id, NoiseConnection.Output);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<NoiseData>)
  );

  const onTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { type: e.target.value as NoiseData["type"] });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Noise</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label>Type:</label>
              <select
                className="nodrag border flex-1"
                value={type}
                onChange={onTypeChange}
              >
                {["white", "pink", "brown"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default NoiseNode;
