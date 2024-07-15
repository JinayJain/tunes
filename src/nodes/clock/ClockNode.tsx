import { NodeProps, Position } from "reactflow";
import { ClockConnection, ClockData, ClockGraphNode } from "./clock";
import useHandle from "../util/useHandle";
import { useTimer } from "react-use-precision-timer";
import { useCallback } from "react";
import { Node } from "../util/Node";
import { TextInput } from "@/components/form";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

function ClockNode(props: NodeProps<ClockData>) {
  const {
    id,
    data: { frequency },
  } = props;

  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<ClockData>)
  );
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<ClockGraphNode>(id))
  );

  const triggerHandleId = useHandle(id, ClockConnection.Trigger);

  const onTimerTick = useCallback(() => {
    graphNode.trigger(false);
    graphNode.trigger(true);
  }, [graphNode]);

  const timer = useTimer(
    {
      delay: 1 / frequency,
    },
    onTimerTick
  );

  const onTimerToggle = useCallback(() => {
    if (timer.isRunning()) {
      graphNode.trigger(false);
      timer.stop();
    } else {
      graphNode.trigger(true);
      timer.start();
    }
  }, [graphNode, timer]);

  const onFrequencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        updateNodeData(id, { frequency: value });
      }
    },
    [id, updateNodeData]
  );

  return (
    <Node {...props} color="red">
      <Node.Handle
        type="source"
        position={Position.Right}
        id={triggerHandleId}
      />
      <Node.Title>Clock</Node.Title>
      <Node.Body className="max-w-64">
        <div className="space-y-2">
          <div className="flex space-x-2 items-center">
            <p>Frequency</p>

            <TextInput
              unit="Hz"
              type="number"
              value={frequency}
              onChange={onFrequencyChange}
            />
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
          <button
            className="text-white bg-red-500 px-2 py-1 hover:bg-red-600 active:bg-red-700 rounded-md"
            onClick={onTimerToggle}
          >
            {timer.isRunning() ? "Stop" : "Start"}
          </button>
        </div>
      </Node.Body>
    </Node>
  );
}

export default ClockNode;
