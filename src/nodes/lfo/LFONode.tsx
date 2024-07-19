import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { OscillatorData, OscillatorConnection } from "../oscillator/oscillator";
import React from "react";
import { Dropdown, TextInput } from "@/components/form";

function LFONode(props: NodeProps<OscillatorData>) {
  const {
    id,
    data: { frequency, type },
  } = props;

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
    <Node {...props} color="red">
      <Node.Title>LFO</Node.Title>
      <Node.Body className="max-w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Node.Handle
                type="target"
                position={Position.Left}
                id={frequencyHandleId}
              />
              <div className="flex space-x-2 items-center">
                <p>Frequency</p>
                <TextInput
                  unit="Hz"
                  type="number"
                  value={frequency}
                  className="flex-1"
                  onChange={onFrequencyChange}
                  min={0.1}
                  max={20}
                  step={0.1}
                />
              </div>
            </div>
            <input
              type="range"
              className="w-full nodrag"
              value={frequency}
              onChange={onFrequencyChange}
              min={0.1}
              max={20}
              step={0.1}
            />
          </div>
          <div className="flex space-x-2 items-center">
            <label htmlFor="lfo-type">Type</label>
            <Dropdown
              id="lfo-type"
              className="flex-1"
              value={type}
              onChange={onTypeChange}
            >
              {["sine", "square", "triangle", "sawtooth"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Dropdown>
          </div>
          <div className="relative">
            <p className="text-right text-gray-500">Output</p>
            <Node.Handle
              type="source"
              position={Position.Right}
              id={outputHandleId}
            />
          </div>
        </div>
      </Node.Body>
    </Node>
  );
}

export default LFONode;
