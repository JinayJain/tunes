import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { FilterData, FilterConnection } from "./filter";
import React from "react";

function FilterNode({
  id,
  selected,
  data: { type, frequency, Q },
}: NodeProps<FilterData>) {
  const inputHandleId = useHandle(id, FilterConnection.Input);
  const outputHandleId = useHandle(id, FilterConnection.Output);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<FilterData>)
  );

  const onTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { type: e.target.value as FilterData["type"] });
    },
    [id, updateNodeData]
  );

  const onFrequencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { frequency: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  const onQChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { Q: parseFloat(e.target.value) });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <Handle type="source" position={Position.Right} id={outputHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Filter</NodeTitle>
        <NodeBody>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label>Type:</label>
              <select
                className="nodrag border flex-1"
                value={type}
                onChange={onTypeChange}
              >
                {[
                  "lowpass",
                  "highpass",
                  "bandpass",
                  "notch",
                  "allpass",
                  "peaking",
                  "lowshelf",
                  "highshelf",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label>Frequency:</label>
              <input
                type="number"
                className="nodrag border flex-1"
                value={frequency}
                onChange={onFrequencyChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label>Q:</label>
              <input
                type="number"
                className="nodrag border flex-1"
                value={Q}
                onChange={onQChange}
              />
            </div>
          </div>
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default FilterNode;
