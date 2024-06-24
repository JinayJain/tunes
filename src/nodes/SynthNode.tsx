import { Handle, NodeProps, Position } from "reactflow";
import NodeBox from "./util/NodeBox";

function SynthNode(props: NodeProps) {
  return (
    <>
      <NodeBox selected={props.selected}>
        <h1 className="text-lg">Synth</h1>
      </NodeBox>
      <Handle type="target" position={Position.Left} />
    </>
  );
}

export default SynthNode;
