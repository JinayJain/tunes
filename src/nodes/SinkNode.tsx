import { Handle, NodeProps, Position } from "reactflow";
import { NodeBody, NodeBox, NodeTitle } from "./util/Node";
import useHandle from "./util/useHandle";
import * as Tone from "tone";
import { useStore } from "../store";
import { SinkConnection, SinkData } from "../graph/sink";
import { useShallow } from "zustand/react/shallow";

function SinkNode({ id, selected, data: { volume } }: NodeProps<SinkData>) {
  const destinationHandleId = useHandle(id, SinkConnection.AudioIn);
  const updateNodeData = useStore(
    useShallow((state) => state.updateNodeData<SinkData>)
  );

  return (
    <>
      <Handle type="target" position={Position.Left} id={destinationHandleId} />
      <NodeBox selected={selected}>
        <NodeTitle>Speaker</NodeTitle>
        <NodeBody>
          <div className="flex items-center space-x-2">
            <label>Volume:</label>
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
          <button
            className="mt-2 text-sm border px-2 py-1 hover:bg-gray-100 active:bg-gray-200"
            onClick={() => Tone.start()}
          >
            Enable Audio
          </button>
        </NodeBody>
      </NodeBox>
    </>
  );
}

export default SinkNode;
