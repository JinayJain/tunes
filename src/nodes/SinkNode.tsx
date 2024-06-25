import { Handle, NodeProps, Position } from "reactflow";
import NodeBox from "./util/NodeBox";
import { useRef, useState } from "react";
import * as Tone from "tone";
import useHandle from "./util/useHandle";

function SinkNode({ id, selected }: NodeProps) {
  const [started, setStarted] = useState(false);
  const destinationRef = useRef<Tone.ToneAudioNode | null>(null);

  if (destinationRef.current === null) {
    destinationRef.current = Tone.getDestination();
  }

  const destinationHandleId = useHandle(id, "input", destinationRef.current);

  const onStart = async () => {
    await Tone.start();
    setStarted(true);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id={destinationHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Output</h1>

        <button
          onClick={onStart}
          disabled={started}
          className="nodrag px-2 py-1 border active:bg-gray-200 hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
        >
          Unmute
        </button>
      </NodeBox>
    </>
  );
}

export default SinkNode;
