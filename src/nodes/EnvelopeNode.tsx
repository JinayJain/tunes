import { Handle, NodeProps, Position } from "reactflow";
import NodeBox from "./util/NodeBox";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import useHandle from "./util/useHandle";
import { Trigger } from "./util/connection";

function EnvelopeNode({ id, selected }: NodeProps) {
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.7);
  const [release, setRelease] = useState(0.1);

  const envelope = useRef<Tone.AmplitudeEnvelope | null>(null);
  if (!envelope.current) {
    envelope.current = new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release,
    });
  }

  const onTrigger = (on: boolean) => {
    console.log("trigger", on);
    if (on) {
      envelope.current?.triggerAttack();
    } else {
      envelope.current?.triggerRelease();
    }
  };

  const trigger = useRef<Trigger | null>(null);
  if (!trigger.current) {
    trigger.current = new Trigger(onTrigger);
  }

  const inputHandleId = useHandle(id, "input", envelope.current.input);
  const outputHandleId = useHandle(id, "output", envelope.current.output);
  const triggerHandleId = useHandle(id, "trigger", trigger.current);

  useEffect(() => {
    if (envelope.current) {
      envelope.current.attack = attack;
      envelope.current.decay = decay;
      envelope.current.sustain = sustain;
      envelope.current.release = release;
    }
  }, [attack, decay, sustain, release]);

  const onAttack = () => {
    envelope.current?.triggerAttack();
  };

  const onRelease = () => {
    envelope.current?.triggerRelease();
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id={inputHandleId} />
      <Handle type="target" position={Position.Top} id={triggerHandleId} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Envelope</h1>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Attack:</label>
          <input
            type="range"
            className="nodrag border"
            value={attack}
            onChange={(e) => setAttack(parseFloat(e.target.value))}
            min={0.01}
            max={2}
            step={0.01}
          />
          <span className="text-xs min-w-[8ch]">{attack}s</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Decay:</label>
          <input
            type="range"
            className="nodrag border"
            value={decay}
            onChange={(e) => setDecay(parseFloat(e.target.value))}
            min={0.01}
            max={2}
            step={0.01}
          />
          <span className="text-xs min-w-[8ch]">{decay}s</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Sustain:</label>
          <input
            type="range"
            className="nodrag border"
            value={sustain}
            onChange={(e) => setSustain(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.01}
          />
          <span className="text-xs min-w-[8ch]">{sustain}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Release:</label>
          <input
            type="range"
            className="nodrag border"
            value={release}
            onChange={(e) => setRelease(parseFloat(e.target.value))}
            min={0.01}
            max={2}
            step={0.01}
          />
          <span className="text-xs min-w-[8ch]">{release}s</span>
        </div>
        <button
          className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
          onMouseDown={onAttack}
          onMouseUp={onRelease}
          onMouseLeave={onRelease}
        >
          Trigger
        </button>
      </NodeBox>
      <Handle type="source" position={Position.Right} id={outputHandleId} />
    </>
  );
}

export default EnvelopeNode;
