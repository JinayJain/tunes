import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { MicrophoneData, MicrophoneConnection } from "./microphone";
import React from "react";

function MicrophoneNode(props: NodeProps<MicrophoneData>) {
  const outputHandleId = useHandle(props.id, MicrophoneConnection.AudioOut);

  return (
    <Node {...props} color="red">
      <Node.Title>Microphone</Node.Title>
      <Node.Body className="max-w-64 space-y-2">
        <div className="relative flex items-center">
          <p className="text-gray-500">Output</p>
          <Node.Handle
            type="source"
            position={Position.Right}
            id={outputHandleId}
          />
        </div>
      </Node.Body>
    </Node>
  );
}

export default MicrophoneNode;
