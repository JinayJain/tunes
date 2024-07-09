import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import { useCallback } from "react";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { ButtonGraphNode, ButtonData, ButtonConnection } from "./button";
import React from "react";

function ButtonNode(props: NodeProps<ButtonData>) {
  const { id } = props;
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
      <Node {...props} color="blue">
        <Node.Handle
          type="source"
          position={Position.Right}
          id={triggerHandleId}
        />
        <Node.Body>
          <button
            className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            Press
          </button>
        </Node.Body>
      </Node>
    </>
  );
}

export default ButtonNode;
