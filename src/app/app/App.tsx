"use client";

import ReactFlow, {
  Background,
  Controls,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useShallow } from "zustand/react/shallow";
import { useDraggable, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { Store, nodeDefinitions, useStore } from "../../store";
import * as Tone from "tone";
import React from "react";
import { toast } from "react-hot-toast";
import { saveCreation } from "./actions";
import { NODE_TYPES } from "@/nodes";

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

  const [idField, setIDField] = useState<string>("");

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
    toast.promise(saveCreation(toObject()), {
      loading: "Saving...",
      success: "Saved!",
      error: "Saving failed.",
    });
  }, [toObject]);

  const onClear = useCallback(() => {
    restoreGraph([], []);
    console.log("Graph cleared.");
  }, [restoreGraph]);

  const onLoad = useCallback(
    async (idToLoad: string) => {
      const response = await fetch(`/api/creation/${idToLoad}`);
      if (!response.ok) {
        toast.error("Failed to load");
        return;
      }

      const data = await response.json();
      const flow = JSON.parse(data.content);

      restoreGraph(flow.nodes, flow.edges);
      setViewport(flow.viewport);
      toast.success("Loaded!");
    },
    [restoreGraph, setViewport]
  );

  return (
    <div className="h-screen">
      <DndContext onDragEnd={onDragEnd}>
        <ReactFlow
          nodeTypes={NODE_TYPES}
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
          <Panel position="bottom-right" className="space-x-2">
            <input
              type="text"
              className="p-2 border rounded-md"
              placeholder="ID"
              value={idField}
              onChange={(e) => setIDField(e.target.value)}
            />
            <button
              className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
              onClick={() => onLoad(idField)}
            >
              Load
            </button>
            <button
              className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag"
              onClick={onSave}
            >
              Save
            </button>
            <button
              className="bg-red-200 hover:bg-red-300 active:bg-red-400 px-2 py-1 nodrag"
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

export default App;
