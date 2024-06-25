import { useState, useEffect, useRef, useCallback } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import NodeBox from "./util/NodeBox";
import clsx from "clsx";
import { useHandles } from "./util/useHandle";
import { Trigger } from "./util/connection";
import { useTimer } from "react-use-precision-timer";

function SequencerNode({
  id,
  selected,
  data,
}: NodeProps & { data: { width: number; height: number } }) {
  const { width, height } = data;
  const [pattern, setPattern] = useState<boolean[][]>(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    )
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const triggers = useRef(Array.from({ length: height }, () => new Trigger()));
  const handles = useHandles(id, triggers.current);

  const triggerStep = useCallback(
    (step: number, on: boolean) => {
      pattern.forEach((row, i) => {
        if (row[step]) {
          triggers.current[i].trigger(on);
        }
      });
    },
    [pattern]
  );

  const onTimer = useCallback(() => {
    const nextStep = (currentStep + 1) % width;
    triggerStep(currentStep, false);
    triggerStep(nextStep, true);

    setCurrentStep((prevStep) => (prevStep + 1) % width);
  }, [currentStep, triggerStep, width]);

  const clock = useTimer({ delay: 100 }, onTimer);

  useEffect(() => {
    if (isRunning) {
      clock.start();
      triggerStep(currentStep, true);
    } else {
      triggerStep(currentStep, false);
      setCurrentStep(0);
      clock.stop();
    }
  }, [isRunning, clock, triggerStep, currentStep]);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Sequencer</h1>

        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="px-2 py-1 border active:bg-gray-200 hover:bg-gray-100"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </div>

        <div
          className={`grid nodrag`}
          style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
        >
          {pattern?.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={clsx(
                  "flex items-center justify-center w-6 h-6 border",
                  {
                    "bg-gray-200 hover:bg-gray-300": j === currentStep && !cell,
                    "bg-teal-500 hover:bg-teal-600": cell && j !== currentStep,
                    "bg-yellow-500 hover:bg-yellow-600":
                      j === currentStep && cell,
                    "bg-white hover:bg-gray-100": j !== currentStep && !cell,
                  }
                )}
                aria-label={`Step ${i}-${j}`}
                onClick={() => {
                  setPattern((prev) => {
                    const newPattern = [...prev];
                    newPattern[i][j] = !cell;
                    return newPattern;
                  });
                }}
              ></button>
            ))
          )}
        </div>
      </NodeBox>
      <div className="flex flex-col">
        {handles.map((handle, i) => (
          <Handle
            key={i}
            type="source"
            position={Position.Right}
            id={handle}
            style={{ top: `${(i / height) * 100}%` }}
          />
        ))}
      </div>
    </>
  );
}

export default SequencerNode;
