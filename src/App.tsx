import ReactFlow, {
  Background,
  Controls,
  Panel,
  NodeAddChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes";
import useStore, { RFState } from "./store";
import { useShallow } from "zustand/react/shallow";
import { useDraggable, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback } from "react";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function App() {
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector)
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!(event.activatorEvent instanceof PointerEvent)) {
        return;
      }

      const { x, y } = event.delta;
      const { clientX, clientY } = event.activatorEvent;
      const type = event.active.id as string;

      const adjustedClientX = clientX + x;
      const adjustedClientY = clientY + y;
      const flowPosition = screenToFlowPosition({
        x: adjustedClientX,
        y: adjustedClientY,
      });

      const node: NodeAddChange = {
        type: "add",
        item: {
          id: `${type}-${nodes.length}`,
          type,
          position: { x: flowPosition.x, y: flowPosition.y },
          data: {
            ...(type === "sequencer" && { width: 16, height: 8 }),
          },
        },
      };

      onNodesChange([node]);
    },
    [nodes.length, onNodesChange, screenToFlowPosition]
  );

  return (
    <div className="h-screen">
      <DndContext onDragEnd={onDragEnd}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <Panel
            position="top-right"
            className="bg-white rounded-md shadow-lg p-4 border min-w-32"
          >
            <h1 className="text-lg">Palette</h1>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.keys(nodeTypes).map((type) => (
                <Draggable key={type} id={type}>
                  <div className="p-2 bg-gray-100 rounded-md shadow-md">
                    {type}
                  </div>
                </Draggable>
              ))}
            </div>
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
