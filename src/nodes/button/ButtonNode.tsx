import { NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import { useCallback } from "react";
import useHandle from "../util/useHandle";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { ButtonGraphNode, ButtonData, ButtonConnection } from "./button";
import React from "react";
import { RiDraggable } from "react-icons/ri";

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
      <Node {...props} color="blue" compact>
        <Node.Handle
          type="source"
          dataType="trigger"
          position={Position.Right}
          id={triggerHandleId}
        />
        <div className="flex items-center">
          <div className="cursor-move">
            <RiDraggable />
          </div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-lg nodrag hover:bg-blue-600 active:bg-blue-700"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            Button
          </button>
        </div>
      </Node>
    </>
  );
}

export default ButtonNode;
