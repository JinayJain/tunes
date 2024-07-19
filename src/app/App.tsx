"use client";

import ReactFlow, {
  Background,
  Controls,
  Panel,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { Store, useStore } from "../store";
import React from "react";
import { NODE_TYPES } from "@/nodes";
import NodePalette from "./NodePalette";
import Modal from "@/components/Modal";
import * as Tone from "tone";

const selector = (state: Store) => ({
  nodes: state.rfNodes,
  edges: state.rfEdges,
  onNodesChange: state.onNodesChange,
  onNodesDelete: state.onNodesDelete,
  onEdgesChange: state.onEdgesChange,
  onEdgesDelete: state.onEdgesDelete,
  onEdgeUpdate: state.onEdgeUpdate,
  onEdgeUpdateStart: state.onEdgeUpdateStart,
  onEdgeUpdateEnd: state.onEdgeUpdateEnd,
  addNode: state.addNode,
  modifyEdge: state.modifyEdge,
  restoreGraph: state.restoreGraph,
});

function App() {
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onNodesDelete,
    onEdgesChange,
    onEdgesDelete,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    onEdgeUpdateStart,
    addNode,
    modifyEdge,
  } = useStore(useShallow(selector));

  const [isModalOpen, setIsModalOpen] = useState(true);

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

  const handleModalClose = useCallback(async () => {
    setIsModalOpen(false);
    await Tone.start();
  }, []);

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
          onEdgesDelete={onEdgesDelete}
          onConnect={(edge) => modifyEdge(edge, "connect")}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls />
          <Panel
            position="top-left"
            className="p-4 bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-600">
              WavePen
            </h1>
          </Panel>
          <Panel position="top-right">
            <NodePalette />
          </Panel>
          {/* <Panel position="bottom-right" className="space-x-2">
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
          </Panel> */}
          <Panel position="bottom-right">
            <button
              className="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 nodrag rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Help
            </button>
          </Panel>
        </ReactFlow>
      </DndContext>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        className="max-w-lg shadow-lg border m-4"
      >
        <h2 className="text-2xl font-bold mb-4">Welcome to WavePen!</h2>
        <div className="space-y-2 mb-4">
          <p>WavePen is a visual tool for creating audio experiences.</p>
          <p>
            To get started,{" "}
            <strong>drag and drop nodes from the palette on the right</strong>{" "}
            to the canvas. At a minimum, you&apos;ll need a Speaker node to hear
            what you create.
          </p>
          <p>
            To learn more about modular synthesis, watch this{" "}
            <a
              href="https://www.youtube.com/watch?v=cWslSTTkiFU"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              <strong>video</strong>
            </a>
            .
          </p>
          <p>
            If you need help, feel free to reach out to{" "}
            <a
              href="mailto:wavepen@jinay.dev"
              className="text-blue-500 hover:underline"
            >
              <strong>wavepen@jinay.dev</strong>
            </a>
            .
          </p>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded-md text-white"
          onClick={handleModalClose}
        >
          Try it out!
        </button>
      </Modal>
    </div>
  );
}

export default App;
