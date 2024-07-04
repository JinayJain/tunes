import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { ReverbData, ReverbConnection } from "./reverb";
import React from "react";

function ReverbNode({
  id,
  selected,
  data: { decay, preDelay, wet },
}: NodeProps<ReverbData>) {
  const inputHandleId = useHandle(id, ReverbConnection.Input);
  const outputHandleId = useHandle(id, ReverbConnection.Output);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<ReverbData>)
  );

  const onDecayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { decay: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  const onPreDelayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { preDelay: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  const onWetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { wet: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <Handle type="source" position={Position.Right} id={outputHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Reverb</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label>Decay:</label>
              <input
                type="number"
                className="nodrag border flex-1"
                value={decay}
                onChange={onDecayChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label>Pre-Delay:</label>
              <input
                type="number"
                className="nodrag border flex-1"
                value={preDelay}
                onChange={onPreDelayChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label>Wet:</label>
              <input
                type="number"
                className="nodrag border flex-1"
                value={wet}
                onChange={onWetChange}
              />
            </div>
          </div>
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default ReverbNode;
