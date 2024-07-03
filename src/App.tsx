"use client";

import ReactFlow, {
  Background,
  Controls,
  NodeProps,
  Panel,
  ReactFlowJsonObject,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useShallow } from "zustand/react/shallow";
import { useDraggable, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useMemo } from "react";
import { NodeTypes, Store, nodeDefinitions, useStore } from "./store";
import SinkNode from "./nodes/SinkNode";
import EnvelopeNode from "./nodes/EnvelopeNode";
import ButtonNode from "./nodes/ButtonNode";
import OscillatorNode from "./nodes/OscillatorNode";
import SequencerNode from "./nodes/SequencerNode";
import LFONode from "./nodes/LFONode";
import MathNode from "./nodes/MathNode";
import * as Tone from "tone";
import React from "react";

const selector = (state: Store) => ({
  nodes: state.rfNodes,
  edges: state.rfEdges,
  onNodesChange: state.onNodesChange,
  onNodesDelete: state.onNodesDelete,
  onEdgesChange: state.onEdgesChange,
  onEdgeUpdate: state.onEdgeUpdate,
  onEdgeUpdateStart: state.onEdgeUpdateStart,
  onEdgeUpdateEnd: state.onEdgeUpdateEnd,
  addNode: state.addNode,
  modifyEdge: state.modifyEdge,
  restoreGraph: state.restoreGraph,
});

const LOCAL_STORE_KEY = "savedFlow";

function App() {
  const { screenToFlowPosition, toObject, setViewport } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onNodesDelete,
    onEdgesChange,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    onEdgeUpdateStart,
    addNode,
    modifyEdge,
    restoreGraph,
  } = useStore(useShallow(selector));

  const nodeTypes = useMemo<Record<NodeTypes, React.ComponentType<NodeProps>>>(
    () => ({
      [NodeTypes.Sink]: SinkNode,
      [NodeTypes.Envelope]: EnvelopeNode,
      [NodeTypes.Button]: ButtonNode,
      [NodeTypes.Oscillator]: OscillatorNode,
      [NodeTypes.Sequencer]: SequencerNode,
      [NodeTypes.LFO]: LFONode,
      [NodeTypes.Math]: MathNode,
    }),
    []
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!(event.activatorEvent instanceof PointerEvent)) {
        return;
      }

      const { clientX, clientY } = event.activatorEvent;
      const type = event.active.id as string;

      const flowPosition = screenToFlowPosition({
        x: clientX + event.delta.x,
        y: clientY + event.delta.y,
      });

      addNode(type, flowPosition);
    },
    [addNode, screenToFlowPosition]
  );

  const onSave = useCallback(() => {
    const data = toObject();
    console.log(btoa(JSON.stringify(data)));
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(data));
    console.log("Data saved to local storage:", data);
  }, [toObject]);

  const onRestore = useCallback(() => {
    const data = localStorage.getItem(LOCAL_STORE_KEY);
    if (data) {
      const parsedData: ReactFlowJsonObject = JSON.parse(data);
      restoreGraph(parsedData.nodes, parsedData.edges);
      setViewport(parsedData.viewport);
    } else {
      console.log("No data found in local storage.");
    }
  }, [restoreGraph, setViewport]);

  const onClear = useCallback(() => {
    restoreGraph([], []);
    console.log("Graph cleared.");
  }, [restoreGraph]);

  useEffect(() => {
    onRestore();
  }, [onRestore]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  return (
    <div className="h-screen">
      <DndContext onDragEnd={onDragEnd}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onEdgesChange={onEdgesChange}
          onReconnect={onEdgeUpdate}
          onReconnectStart={onEdgeUpdateStart}
          onReconnectEnd={onEdgeUpdateEnd}
          onConnect={(edge) => modifyEdge(edge, "connect")}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls />
          <Panel
            position="top-right"
            className="border-2 border-rose-600 p-4 rounded-md bg-rose-50"
          >
            <h1 className="text-xl font-bold">Palette</h1>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Object.entries(nodeDefinitions).map(([type, { label }]) => (
                <Draggable key={type} id={type}>
                  <div className="bg-rose-600 p-2 rounded-md cursor-move text-white">
                    {label}
                  </div>
                </Draggable>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-700">
              Can&apos;t hear anything? Click{" "}
              <button className="underline" onClick={() => Tone.start()}>
                here
              </button>{" "}
              to enable audio.
            </p>
          </Panel>
          <Panel position="bottom-right">
            <button
              className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
              onClick={onSave}
            >
              Save
            </button>
            <button
              className="bg-green-200 hover:bg-green-300 active:bg-green-400 px-2 py-1 nodrag ml-2"
              onClick={onRestore}
            >
              Restore
            </button>
            <button
              className="bg-red-200 hover:bg-red-300 active:bg-red-400 px-2 py-1 nodrag ml-2"
              onClick={onClear}
            >
              Clear
            </button>
          </Panel>
        </ReactFlow>
      </DndContext>
    </div>
  );
}

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

export default App;
