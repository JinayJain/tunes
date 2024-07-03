import { Handle, NodeProps, Position } from "reactflow";
import { NodeBox, NodeBody } from "../util/Node";
import { useCallback } from "react";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { ButtonGraphNode, ButtonData, ButtonConnection } from "./button";
import React from "react";

function ButtonNode({ id, selected }: NodeProps<ButtonData>) {
  const triggerHandleId = useHandle(id, ButtonConnection.Trigger);
  const graphNode = useStore(
    useShallow((state) => state.getGraphNode<ButtonGraphNode>(id))
  );

  const onMouseDown = useCallback(() => {
    graphNode.trigger(true);
  }, [graphNode]);

  const onMouseUp = useCallback(() => {
    graphNode.trigger(false);
  }, [graphNode]);

  return (
    <>
      <Handle type="source" position={Position.Right} id={triggerHandleId} />
      <NodeBox selected={selected}>
        <NodeBody>
          <button
            className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            Press
          </button>
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default ButtonNode;
