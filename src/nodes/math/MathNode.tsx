import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { MathData, MathOperation, MathConnection } from "./math";
import React from "react";

function MathNode({
  id,
  selected,
  data: { operation, operand1Value, operand2Value },
}: NodeProps<MathData>) {
  const operand1HandleId = useHandle(id, MathConnection.Operand1);
  const operand2HandleId = useHandle(id, MathConnection.Operand2);
  const outputHandleId = useHandle(id, MathConnection.Output);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<MathData>)
  );

  const onOperand1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        updateNodeData(id, { operand1Value: value });
      }
    },
    [id, updateNodeData]
  );

  const onOperand2Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        updateNodeData(id, { operand2Value: value });
      }
    },
    [id, updateNodeData]
  );

  const onOperationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { operation: e.target.value as MathOperation });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <div className="space-y-4">
        <Handle type="target" position={Position.Left} id={operand1HandleId} />
        <Handle type="target" position={Position.Left} id={operand2HandleId} />
      </div>
      <NodeBox selected={selected}>
        <NodeTitle>Math</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="block">
              <input
                type="number"
                className="nodrag border"
                value={operand1Value}
                onChange={onOperand1Change}
              />
            </div>

            <div className="block">
              <input
                type="number"
                className="nodrag border"
                value={operand2Value}
                onChange={onOperand2Change}
              />
            </div>

            <div className="flex items-center space-x-2">
              <label>Operation:</label>
              <select
                className="nodrag border flex-1"
                value={operation}
                onChange={onOperationChange}
              >
                {Object.values(MathOperation).map((op) => (
                  <option key={op} value={op}>
                    {op}
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

export default MathNode;
