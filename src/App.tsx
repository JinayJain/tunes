import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useState } from "react";
import PianoNode from "./nodes/PianoNode";
import SynthNode from "./nodes/SynthNode";
import MuteNode from "./nodes/MuteNode";

const nodeTypes = {
  piano: PianoNode,
  synth: SynthNode,
  mute: MuteNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "piano",
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: "2",
    type: "synth",
    position: { x: 400, y: 100 },
    data: {},
  },

  {
    id: "3",
    type: "mute",
    position: { x: 500, y: 100 },
    data: {},
  },
];

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-screen">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
