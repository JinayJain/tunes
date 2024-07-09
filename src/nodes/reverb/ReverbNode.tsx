import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { ReverbData, ReverbConnection } from "./reverb";
import React from "react";
import { TextInput } from "@/components/form";

function ReverbNode(props: NodeProps<ReverbData>) {
  const {
    id,
    data: { decay, preDelay, wet },
  } = props;
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
    <Node {...props} color="yellow">
      <Node.Handle type="target" position={Position.Left} id={inputHandleId} />
      <Node.Handle
        type="source"
        position={Position.Right}
        id={outputHandleId}
      />
      <Node.Title>Reverb</Node.Title>
      <Node.Body>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label>Decay</label>
            <TextInput
              type="number"
              className="nodrag flex-1"
              value={decay}
              onChange={onDecayChange}
              unit="s"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label>Pre-Delay</label>
            <TextInput
              type="number"
              className="nodrag flex-1"
              value={preDelay}
              onChange={onPreDelayChange}
              unit="s"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label>Wet</label>
            <TextInput
              type="number"
              className="nodrag flex-1"
              value={wet}
              onChange={onWetChange}
            />
          </div>
        </div>
      </Node.Body>
    </Node>
  );
}

export default ReverbNode;
