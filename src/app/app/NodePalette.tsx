"use client";

import { nodeDefinitions } from "@/store";
import { useDraggable } from "@dnd-kit/core";
import * as Tone from "tone";

function Draggable(props: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

function NodePalette() {
  return (
    <div className="p-4 bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg">
      <h1 className="text-gray-700 text-lg">Palette</h1>
      <p className="text-gray-500">
        Drag and drop a node to add it to the canvas
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(nodeDefinitions).map(([type, { label }]) => (
          <Draggable key={type} id={type}>
            <div className="p-2 rounded-md cursor-move border shadow-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-transform duration-300 transform hover:scale-105 active:scale-95">
              {label}
            </div>
          </Draggable>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Can&apos;t hear anything? Click{" "}
        <button className="underline" onClick={() => Tone.start()}>
          here
        </button>{" "}
        to enable audio.
      </p>
    </div>
  );
}

export default NodePalette;
