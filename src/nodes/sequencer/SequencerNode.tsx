import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../../store";
import { useCallback, useState } from "react";
import { useTimer } from "react-use-precision-timer";
import clsx from "clsx";
import React from "react";
import {
  SequencerConnection,
  SequencerData,
  SequencerGraphNode,
} from "./sequencer";

function SequencerNode(props: NodeProps<SequencerData>) {
  const {
    id,
    data: { steps },
  } = props;

  const triggerInHandleId = useHandle(id, SequencerConnection.TriggerIn);
  const triggerOutHandleId = useHandle(id, SequencerConnection.TriggerOut);
  const [currentStep, setCurrentStep] = useState(0);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<SequencerData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<SequencerGraphNode>(id))
  );

  const onTimerTick = useCallback(() => {
    const nextStep = (currentStep + 1) % steps.length;
    if (steps[currentStep]) {
      graphNode.trigger(false);
    }
    if (steps[nextStep]) {
      graphNode.trigger(true);
    }
    setCurrentStep(nextStep);
  }, [currentStep, steps, graphNode]);

  const timer = useTimer(
    {
      delay: 250,
    },
    onTimerTick
  );

  const onStepClick = useCallback(
    (index: number) => {
      const newSteps = [...steps];
      newSteps[index] = !newSteps[index];
      updateNodeData(id, { steps: newSteps });
    },
    [id, steps, updateNodeData]
  );

  const onTimerToggle = useCallback(() => {
    if (timer.isRunning()) {
      timer.stop();
      setCurrentStep(0);
      graphNode.trigger(false);
    } else {
      timer.start();
      if (steps[currentStep]) {
        graphNode.trigger(true);
      }
    }
  }, [currentStep, graphNode, steps, timer]);

  return (
    <Node {...props} color="green">
      <Node.Handle
        type="target"
        position={Position.Left}
        id={triggerInHandleId}
      />
      <Node.Handle
        type="source"
        position={Position.Right}
        id={triggerOutHandleId}
      />
      <Node.Title>Sequencer</Node.Title>
      <Node.Body>
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
        <button
          onClick={onTimerToggle}
          className="mt-2 px-2 py-1 text-sm border rounded-md hover:bg-gray-200"
        >
          {timer.isRunning() ? "Stop" : "Start"}
        </button>
      </Node.Body>
    </Node>
  );
}

export default SequencerNode;
