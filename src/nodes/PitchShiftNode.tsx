import { useState, useRef, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import * as Tone from "tone";
import NodeBox from "./util/NodeBox";
import useHandle from "./util/useHandle";

function PitchShiftNode({ id, selected }: NodeProps) {
  const [pitch, setPitch] = useState(0);
  const [windowSize, setWindowSize] = useState(0.1);
  const [delayTime, setDelayTime] = useState(0.0);
  const [feedback, setFeedback] = useState(0.0);
  const [wet, setWet] = useState(1);

  const pitchShift = useRef<Tone.PitchShift | null>(null);
  if (pitchShift.current === null) {
    pitchShift.current = new Tone.PitchShift({
      pitch,
      windowSize,
      delayTime,
      feedback,
      wet,
    });
  }

  const inputHandleId = useHandle(id, "input", pitchShift.current);
  const outputHandleId = useHandle(id, "output", pitchShift.current);

  useEffect(() => {
    if (pitchShift.current) {
      pitchShift.current.pitch = pitch;
      pitchShift.current.windowSize = windowSize;
      pitchShift.current.delayTime.value = delayTime;
      pitchShift.current.feedback.value = feedback;
      pitchShift.current.wet.value = wet;
    }
  }, [pitch, windowSize, delayTime, feedback, wet]);

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Pitch Shift</h1>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <label className="text-xs">Pitch:</label>
            <input
              type="number"
              className="nodrag border"
              value={pitch}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setPitch(value);
                }
              }}
              step={0.1}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Window Size:</label>
            <input
              type="number"
              className="nodrag border"
              value={windowSize}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setWindowSize(value);
                }
              }}
              step={0.01}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Delay Time:</label>
            <input
              type="number"
              className="nodrag border"
              value={delayTime}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setDelayTime(value);
                }
              }}
              step={0.01}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Feedback:</label>
            <input
              type="range"
              className="nodrag border"
              value={feedback}
              onChange={(e) => setFeedback(parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.01}
            />
            <span className="text-xs min-w-[8ch]">{feedback}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Wet:</label>
            <input
              type="range"
              className="nodrag border"
              value={wet}
              onChange={(e) => setWet(parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.01}
            />
            <span className="text-xs min-w-[8ch]">{wet}</span>
          </div>
        </div>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default PitchShiftNode;
