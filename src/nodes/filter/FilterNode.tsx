import { Handle, NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { FilterData, FilterConnection } from "./filter";
import React from "react";
import { Dropdown, TextInput } from "@/components/form";

function FilterNode(props: NodeProps<FilterData>) {
  const {
    id,
    data: { type, frequency, Q },
  } = props;

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
    <Node color="green" {...props}>
      <Node.Handle type="target" position={Position.Left} id={inputHandleId} />
      <Node.Handle
        type="source"
        position={Position.Right}
        id={outputHandleId}
      />
      <Node.Title>Filter</Node.Title>
      <Node.Body className="max-w-64">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label>Type</label>
            <Dropdown className="flex-1" value={type} onChange={onTypeChange}>
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
            </Dropdown>
          </div>
          <div className="flex items-center space-x-2">
            <label>Frequency</label>
            <TextInput
              className="flex-1"
              type="number"
              value={frequency}
              onChange={onFrequencyChange}
              unit="Hz"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label>Q</label>
            <TextInput
              className="flex-1"
              type="number"
              value={Q}
              onChange={onQChange}
            />
          </div>
        </div>
      </Node.Body>
    </Node>
  );
}

export default FilterNode;
