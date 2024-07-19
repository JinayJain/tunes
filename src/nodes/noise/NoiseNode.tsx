import { Handle, NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { NoiseData, NoiseConnection } from "./noise";
import React from "react";
import clsx from "clsx";

function NoiseNode(props: NodeProps<NoiseData>) {
  const {
    id,
    data: { type },
  } = props;

  const outputHandleId = useHandle(id, NoiseConnection.Output);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<NoiseData>)
  );

  const onTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { type: e.target.value as NoiseData["type"] });
    },
    [id, updateNodeData]
  );

  return (
    <Node {...props} color="red">
      <Node.Title>noise</Node.Title>
      <Node.Body className="space-y-2">
        <div className="relative">
          <div className="flex flex-col space-y-1">
            {["white", "pink", "brown"].map((noiseType) => (
              <div
                className={clsx(
                  "space-x-1 flex items-center *:cursor-pointer nodrag",
                  type === noiseType
                    ? "text-gray-600"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <input
                  type="radio"
                  value={noiseType}
                  id={noiseType}
                  onChange={onTypeChange}
                  checked={type === noiseType}
                  className="form-radio w-4 h-4"
                />
                <label htmlFor={noiseType}>{noiseType}</label>
              </div>
            ))}
          </div>
          <Node.Handle
            type="source"
            position={Position.Right}
            id={outputHandleId}
            className="w-3 h-3 bg-red-500 -right-1.5"
          />
        </div>
      </Node.Body>
    </Node>
  );
}

export default NoiseNode;
