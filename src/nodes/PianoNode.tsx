import { useRef } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import * as Tone from "tone";
import { Chord } from "tonal";
import clsx from "clsx";
import NodeBox from "./util/NodeBox";

const NOTES = ["C4", "D4", "E4", "G4", "A4"];

function PianoNode({ selected }: NodeProps) {
  const synth = useRef(
    new Tone.PolySynth({
      options: {
        envelope: {
          attack: 1.0,
          decay: 0.1,
          sustain: 0.9,
        },
      },
    }).toDestination()
  );

  const playNote = (note: string) => {
    const notes = Chord.notes("maj7", note);

    synth.current.triggerAttack(notes);
  };

  const stopNote = () => {
    synth.current.releaseAll();
  };

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <NodeBox selected={selected}>
        <h1 className="text-lg">Piano</h1>
        <div className="flex">
          {NOTES.map((note) => (
            <button
              key={note}
              className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
              onMouseDown={() => playNote(note)}
              onMouseUp={stopNote}
              onMouseLeave={stopNote}
            >
              {note}
            </button>
          ))}
        </div>
      </NodeBox>
    </>
  );
}

export default PianoNode;
