import { useRef, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function MicrophoneNode({ id, selected }: NodeProps) {
  const mic = useRef<Tone.UserMedia | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!mic.current) {
    mic.current = new Tone.UserMedia();
  }

  const outputHandleId = useHandle(id, "output", mic.current);

  const handleOpen = () => {
    mic.current?.open();
    setIsOpen(true);
  };

  const handleClose = () => {
    mic.current?.close();
    setIsOpen(false);
  };

  return (
    <>
      <NodeBox selected={selected}>
        <h1 className="text-lg">Microphone</h1>
        {isOpen ? (
          <button
            onClick={handleClose}
            className="nodrag px-2 py-1 border active:bg-gray-200 hover:bg-gray-100"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleOpen}
            className="nodrag px-2 py-1 border active:bg-gray-200 hover:bg-gray-100"
          >
            Open
          </button>
        )}
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default MicrophoneNode;
