import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import * as Tone from "tone";
import { Connectable, Trigger } from "./nodes/util/connection";

const initialNodes: Node[] = [
  {
    type: "sink",
    id: "output",
    position: { x: 0, y: 0 },
    data: {},
  },
];
const initialEdges: Edge[] = [];

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  connectables: Map<string, Connectable>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  register: (id: string, audioNode: Connectable) => void;
  unregister: (id: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  connectables: new Map(),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    const sourceAudioNode = get().connectables.get(
      connection.sourceHandle ?? ""
    );
    const targetAudioNode = get().connectables.get(
      connection.targetHandle ?? ""
    );

    if (!sourceAudioNode || !targetAudioNode) {
      return;
    }

    if (
      sourceAudioNode instanceof Trigger &&
      targetAudioNode instanceof Trigger
    ) {
      sourceAudioNode.connect(targetAudioNode);
    } else if (
      sourceAudioNode instanceof Tone.ToneAudioNode &&
      targetAudioNode instanceof Tone.ToneAudioNode
    ) {
      sourceAudioNode.connect(targetAudioNode);
    }

    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  register: (id: string, audioNode: Connectable) => {
    set((state) => ({
      connectables: new Map(state.connectables).set(id, audioNode),
    }));
  },
  unregister: (id: string) => {
    set((state) => {
      const connectables = new Map(state.connectables);
      connectables.delete(id);
      return { connectables: connectables };
    });
  },
}));

export default useStore;
