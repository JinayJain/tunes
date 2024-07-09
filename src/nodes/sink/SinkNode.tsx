import { Handle, NodeProps, Position } from "reactflow";
import { Node } from "../util/Node";
import useHandle from "../util/useHandle";
import * as Tone from "tone";
import { useStore } from "../../store";
import { SinkConnection, SinkData } from "./sink";
import { useShallow } from "zustand/react/shallow";
import React from "react";

function SinkNode(props: NodeProps<SinkData>) {
  const {
    id,
    data: { volume },
  } = props;

  const destinationHandleId = useHandle(id, SinkConnection.AudioIn);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<SinkData>)
  );

  return (
    <>
      <Node {...props} color="blue">
        <Node.Handle
          type="target"
          position={Position.Left}
          id={destinationHandleId}
        />
        <Node.Title>Speaker</Node.Title>
        <Node.Body>
          <div className="flex items-center space-x-2">
            <label>Volume</label>
            <input
              type="range"
              className="nodrag border"
              value={Tone.dbToGain(volume)}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  updateNodeData(id, { volume: Tone.gainToDb(value) });
                }
              }}
              min={0}
              max={1}
              step={0.01}
            />
            <span className="min-w-[4ch]">
              {Math.round(Tone.dbToGain(volume) * 100)}%
            </span>
          </div>
        </Node.Body>
      </Node>
    </>
  );
}

export default SinkNode;
