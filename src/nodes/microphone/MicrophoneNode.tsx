import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import {
  MicrophoneData,
  MicrophoneConnection,
  MicrophoneGraphNode,
} from "./microphone";
import React from "react";

function MicrophoneNode(props: NodeProps<MicrophoneData>) {
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<MicrophoneGraphNode>(props.id))
  );

  const onEnable = async () => {};

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

        <button
          onClick={onEnable}
          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 active:bg-red-700"
        >
          Enable
        </button>
      </Node.Body>
    </Node>
  );
}

export default MicrophoneNode;
