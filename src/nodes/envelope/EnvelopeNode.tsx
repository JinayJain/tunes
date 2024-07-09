import { Handle, NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import { useCallback } from "react";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import {
  EnvelopeGraphNode,
  EnvelopeData,
  EnvelopeConnection,
} from "./envelope";
import React from "react";

function EnvelopeNode(props: NodeProps<EnvelopeData>) {
  const {
    id,
    data: { attack, decay, sustain, release },
  } = props;

  const inputHandleId = useHandle(id, EnvelopeConnection.AudioIn);
  const outputHandleId = useHandle(id, EnvelopeConnection.AudioOut);
  const triggerHandleId = useHandle(id, EnvelopeConnection.Trigger);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<EnvelopeData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<EnvelopeGraphNode>(id))
  );

  const handleChange =
    (field: keyof EnvelopeData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        updateNodeData(id, { [field]: value });
      }
    };

  const onAttack = useCallback(() => {
    graphNode.trigger(true);
  }, [graphNode]);
  const onRelease = useCallback(() => {
    graphNode.trigger(false);
  }, [graphNode]);

  return (
    <>
      <Node {...props} color="green">
        <Node.Handle
          type="target"
          position={Position.Left}
          id={inputHandleId}
        />
        <Node.Handle
          type="target"
          position={Position.Top}
          id={triggerHandleId}
        />
        <Node.Title>Envelope</Node.Title>
        <Node.Body>
          <div className="space-y-1">
            {[
              {
                label: "Attack",
                value: attack,
                min: 0.01,
                max: 2,
                step: 0.01,
                unit: "s",
              },
              {
                label: "Decay",
                value: decay,
                min: 0.01,
                max: 2,
                step: 0.01,
                unit: "s",
              },
              {
                label: "Sustain",
                value: sustain,
                min: 0,
                max: 1,
                step: 0.01,
                unit: "",
              },
              {
                label: "Release",
                value: release,
                min: 0.01,
                max: 2,
                step: 0.01,
                unit: "s",
              },
            ].map(({ label, value, min, max, step, unit }) => (
              <div key={label} className="flex items-center space-x-2">
                <label>{label}</label>
                <input
                  type="range"
                  className="nodrag border flex-1"
                  value={value}
                  onChange={handleChange(
                    label.toLowerCase() as keyof EnvelopeData
                  )}
                  min={min}
                  max={max}
                  step={step}
                />
                <span className="min-w-[4ch]">
                  {value}
                  {unit}
                </span>
              </div>
            ))}
            <button
              className="text-white bg-green-500 hover:bg-green-600 active:bg-green-700 px-2 py-1 rounded-md"
              onMouseDown={onAttack}
              onMouseUp={onRelease}
              onMouseLeave={onRelease}
            >
              Trigger
            </button>
          </div>
        </Node.Body>
        <Node.Handle
          type="source"
          position={Position.Right}
          id={outputHandleId}
        />
      </Node>
    </>
  );
}

export default EnvelopeNode;
