import { Handle, NodeProps, Position } from "reactflow";
import { NodeBox, NodeBody, NodeTitle } from "./util/Node";
import { useCallback } from "react";
import useHandle from "./util/useHandle";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { Envelope, EnvelopeData, EnvelopeConnection } from "../graph/envelope";

function EnvelopeNode({
  id,
  selected,
  data: { attack, decay, release, sustain },
}: NodeProps<EnvelopeData>) {
  const inputHandleId = useHandle(id, EnvelopeConnection.AudioIn);
  const outputHandleId = useHandle(id, EnvelopeConnection.AudioOut);
  const triggerHandleId = useHandle(id, EnvelopeConnection.Trigger);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<EnvelopeData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<Envelope>(id))
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
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <Handle type="target" position={Position.Top} id={triggerHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Envelope</NodeTitle>
        <NodeBody>
          {" "}
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
              <label>{label}:</label>
              <input
                type="range"
                className="nodrag border"
                value={value}
                onChange={handleChange(
                  label.toLowerCase() as keyof EnvelopeData
                )}
                min={min}
                max={max}
                step={step}
              />
              <span className="min-w-[8ch]">
                {value}
                {unit}
              </span>
            </div>
          ))}
          <button
            className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
            onMouseDown={onAttack}
            onMouseUp={onRelease}
            onMouseLeave={onRelease}
          >
            Trigger
          </button>
        </NodeBody>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default EnvelopeNode;
