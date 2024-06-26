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
  OnEdgeUpdateFunc,
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
  edgeUpdateSuccessful: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onEdgeUpdate: OnEdgeUpdateFunc;
  onEdgeUpdateStart: (event: unknown, edge: Edge) => void;
  onEdgeUpdateEnd: (event: unknown, edge: Edge) => void;
  onConnect: OnConnect;
  modifyConnection: (
    connector: Edge | Connection,
    action: "connect" | "disconnect"
  ) => void;
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
  edgeUpdateSuccessful: false,
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
  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => {
    get().modifyConnection(oldEdge, "disconnect");
    get().modifyConnection(newConnection, "connect");
    set({
      edgeUpdateSuccessful: true,
    });
  },
  onEdgeUpdateStart: () => {
    set({
      edgeUpdateSuccessful: false,
    });
  },
  onEdgeUpdateEnd: (_, edge) => {
    if (get().edgeUpdateSuccessful) {
      return;
    }

    set({
      edgeUpdateSuccessful: true,
    });

    get().modifyConnection(edge, "disconnect");
  },
  onConnect: (connection: Connection) => {
    get().modifyConnection(connection, "connect");
  },
  modifyConnection: (connector, action) => {
    const sourceConnectable = get().connectables.get(
      connector.sourceHandle || ""
    );
    const targetConnectable = get().connectables.get(
      connector.targetHandle || ""
    );

    if (!sourceConnectable || !targetConnectable) {
      return;
    }

    if (
      sourceConnectable instanceof Trigger &&
      targetConnectable instanceof Trigger
    ) {
      if (action === "connect") {
        sourceConnectable.connect(targetConnectable);
      } else if (action === "disconnect") {
        sourceConnectable.disconnect(targetConnectable);
      }
    } else if (
      sourceConnectable instanceof Tone.ToneAudioNode &&
      targetConnectable instanceof Tone.ToneAudioNode
    ) {
      if (action === "connect") {
        sourceConnectable.connect(targetConnectable);
      } else if (action === "disconnect") {
        sourceConnectable.disconnect(targetConnectable);
      }
    }

    if (action === "connect") {
      set({
        edges: addEdge(connector, get().edges),
      });
    } else if (action === "disconnect" && "id" in connector) {
      set({
        edges: get().edges.filter((edge) => edge.id !== connector.id),
      });
    }
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
