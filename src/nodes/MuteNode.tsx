import { useState } from "react";
import { NodeProps } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";

function MuteNode(props: NodeProps) {
  const [started, setStarted] = useState(false);

  const onStart = async () => {
    await Tone.start();
    setStarted(true);
  };

  return (
    <>
      <NodeBox selected={props.selected}>
        <button
          onClick={onStart}
          disabled={started}
          className="bg-white px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100 active:bg-gray-200 nodrag"
        >
          Start
        </button>
      </NodeBox>
    </>
  );
}

export default MuteNode;
