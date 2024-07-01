import { Handle, NodeProps, Position } from "reactflow";
import { Sequencer, SequencerData } from "../graph/sequencer";
import { NodeBody, NodeBox, NodeTitle } from "./util/Node";
import useHandle from "./util/useHandle";
import { ButtonConnection } from "../graph/button";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store";
import { useCallback, useState } from "react";
import { useTimer } from "react-use-precision-timer";
import clsx from "clsx";

function SequencerNode({
  id,
  selected,
  data: { steps },
}: NodeProps<SequencerData>) {
  const triggerHandleId = useHandle(id, ButtonConnection.Trigger);
  const [currentStep, setCurrentStep] = useState(0);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<SequencerData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<Sequencer>(id))
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
    <>
      <Handle type="source" position={Position.Right} id={triggerHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Sequencer</NodeTitle>
        <NodeBody>
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <button
                key={index}
                className={clsx(
                  step ? "bg-gray-800" : "bg-gray-200",
                  index === currentStep && "border-2 border-teal-500",
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
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default SequencerNode;
