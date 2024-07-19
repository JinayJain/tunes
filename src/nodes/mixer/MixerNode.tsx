import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import React from "react";
import { MixerData } from "./mixer";

function MixerNode(props: NodeProps<MixerData>) {
  const { id } = props;

  const inputHandleId1 = useHandle(id, "input1");
  const inputHandleId2 = useHandle(id, "input2");
  const outputHandleId = useHandle(id, "output");

  return (
    <Node {...props} color="blue">
      <div className="flex space-y-8">
        <Node.Handle
          type="target"
          position={Position.Left}
          id={inputHandleId1}
        />
        <Node.Handle
          type="target"
          position={Position.Left}
          id={inputHandleId2}
        />
      </div>
      <Node.Title>Mixer</Node.Title>
      <Node.Body>
        <div className="space-y-2">
          <p>Mixing audio inputs</p>
        </div>
      </Node.Body>
      <Node.Handle
        type="source"
        position={Position.Right}
        id={outputHandleId}
      />
    </Node>
  );
}

export default MixerNode;
