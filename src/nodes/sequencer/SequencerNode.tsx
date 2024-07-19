import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../../store";
import { useCallback } from "react";
import clsx from "clsx";
import React from "react";
import {
  SequencerConnection,
  SequencerData,
  SequencerGraphNode,
} from "./sequencer";
import { Trigger } from "../util/graph";

function SequencerNode(props: NodeProps<SequencerData>) {
  const {
    id,
    data: { steps, currentStep },
  } = props;

  const triggerInHandleId = useHandle(id, SequencerConnection.TriggerIn);
  const triggerOutHandleId = useHandle(id, SequencerConnection.TriggerOut);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<SequencerData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<SequencerGraphNode>(id))
  );

  const onStepClick = useCallback(
    (index: number) => {
      const newSteps = [...steps];
      newSteps[index] = !newSteps[index];
      updateNodeData(id, { steps: newSteps });
    },
    [id, steps, updateNodeData]
  );
  const onReset = useCallback(() => {
    updateNodeData(id, { currentStep: 0 });
    const trigger = graphNode.getConnectable(
      SequencerConnection.TriggerOut
    ) as Trigger;
    trigger.trigger(false);
  }, [graphNode, id, updateNodeData]);

  return (
    <Node {...props} color="green">
      <Node.Title>Sequencer</Node.Title>
      <Node.Body className="space-y-2">
        <div className="relative flex items-center">
          <p className="text-gray-500 mr-2">Clock</p>
          <Node.Handle
            type="target"
            position={Position.Left}
            id={triggerInHandleId}
          />
          <button
            className="nodrag text-sm border border-green-500 text-green-500 px-2 py-1 rounded-md bg-white hover:bg-gray-100 active:bg-gray-200"
            onClick={onReset}
          >
            Reset
          </button>
        </div>

        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <button
              key={index}
              className={clsx(
                step
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300",
                index === currentStep && "border-2 border-green-500",
                "h-8 w-8 rounded-md nodrag"
              )}
              onClick={() => onStepClick(index)}
            ></button>
          ))}
        </div>

        <div className="relative">
          <p className="text-gray-500 text-right">Output</p>
          <Node.Handle
            type="source"
            position={Position.Right}
            id={triggerOutHandleId}
          />
        </div>
      </Node.Body>
    </Node>
  );
}

export default SequencerNode;
