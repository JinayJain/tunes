import { useRef } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";
import { Trigger } from "./util/connection";

function ButtonNode({ id, selected }: NodeProps) {
  const trigger = useRef<Trigger | null>(null);
  if (!trigger.current) {
    trigger.current = new Trigger();
  }
  const outputHandleId = useHandle(id, "output", trigger.current);

  return (
    <>
      <NodeBox selected={selected}>
        <h1 className="text-lg">Button</h1>
        <button
          onMouseDown={() => trigger.current?.trigger(true)}
          onMouseUp={() => trigger.current?.trigger(false)}
          onMouseLeave={() => trigger.current?.trigger(false)}
          className="nodrag px-2 py-1 border active:bg-gray-200 hover:bg-gray-100"
        >
          Press
        </button>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default ButtonNode;
