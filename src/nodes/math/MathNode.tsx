import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { MathData, MathOperation, MathConnection } from "./math";
import React from "react";
import { Dropdown, TextInput } from "@/components/form";

function MathNode(props: NodeProps<MathData>) {
  const {
    id,
    data: { operand1Value, operand2Value, operation },
  } = props;

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
    <Node {...props} color="yellow">
      <Node.Title>Math</Node.Title>
      <Node.Body className="space-y-2">
        <div className="space-y-2">
          <div className="relative">
            <Node.Handle
              type="target"
              position={Position.Left}
              id={operand1HandleId}
            />
            <TextInput
              type="number"
              className="nodrag"
              value={operand1Value}
              onChange={onOperand1Change}
            />
          </div>

          <div className="relative">
            <Node.Handle
              type="target"
              position={Position.Left}
              id={operand2HandleId}
            />
            <TextInput
              type="number"
              className="nodrag"
              value={operand2Value}
              onChange={onOperand2Change}
            />
          </div>

          <Dropdown
            className="nodrag border w-full"
            value={operation}
            onChange={onOperationChange}
          >
            {Object.values(MathOperation).map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </Dropdown>
        </div>

        <div className="relative">
          <p className="text-right text-gray-500">Result</p>
          <Node.Handle
            type="source"
            position={Position.Right}
            id={outputHandleId}
          />
        </div>
      </Node.Body>
    </Node>
  );
}

export default MathNode;
