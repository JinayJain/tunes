import { useRef } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";
import { Trigger } from "./util/connection";

function PianoNode({ id, selected }: NodeProps) {
  const signal = useRef<Tone.Signal<"frequency"> | null>(null);
  if (signal.current === null) {
    signal.current = new Tone.Signal({
      value: "C4",
      units: "frequency",
    });
  }
  const trigger = useRef<Trigger | null>(null);
  if (trigger.current === null) {
    trigger.current = new Trigger();
  }
  const outputHandleId = useHandle(id, "output", signal.current);
  const triggerHandleId = useHandle(id, "trigger", trigger.current);

  return (
    <>
      <NodeBox selected={selected}>
        <h1 className="text-lg">Piano</h1>
        <div className="flex space-x-1">
          {["C4", "D4", "E4", "F4", "G4", "A4", "B4"].map((note) => (
            <button
              key={note}
              className="flex-1 p-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 active:bg-gray-300 nodrag"
              onMouseDown={() => {
                signal.current!.value = note;
                trigger.current!.trigger(true);
              }}
              onMouseUp={() => {
                trigger.current!.trigger(false);
              }}
              onMouseLeave={() => {
                trigger.current!.trigger(false);
              }}
            >
              {note}
            </button>
          ))}
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
      <Handle type="source" position={Position.Bottom} id={triggerHandleId} />
    </>
  );
}

export default PianoNode;
