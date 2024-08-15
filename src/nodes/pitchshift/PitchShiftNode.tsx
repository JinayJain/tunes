import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { PitchShiftData } from "./pitchshift";
import React from "react";
import { TextInput } from "@/components/form";

function PitchShiftNode(props: NodeProps<PitchShiftData>) {
  const {
    id,
    data: { pitch },
  } = props;
  const inputHandleId = useHandle(id, "input");
  const outputHandleId = useHandle(id, "output");
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<PitchShiftData>)
  );

  const onPitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { pitch: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  return (
    <Node {...props} color="blue">
      <Node.Title>Pitch Shift</Node.Title>
      <Node.Body className="space-y-2">
        <div className="relative flex items-center justify-between">
          <Node.Handle
            type="target"
            position={Position.Left}
            id={inputHandleId}
          />
          <p className="text-gray-500">Input</p>
          <Node.Handle
            type="source"
            position={Position.Right}
            id={outputHandleId}
          />
          <p className="text-gray-500 text-right">Output</p>
        </div>

        <div className="flex items-center space-x-2">
          <label>Pitch</label>
          <TextInput
            type="number"
            className="nodrag flex-1"
            value={pitch}
            onChange={onPitchChange}
          />
        </div>
      </Node.Body>
    </Node>
  );
}

export default PitchShiftNode;
