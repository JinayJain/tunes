import { nanoid } from "nanoid";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  Connection,
  addEdge,
  OnNodesDelete,
  OnEdgeUpdateFunc,
} from "reactflow";
import { create } from "zustand";
import { GraphNode, connect, disconnect } from "./graph";
import { defaultEnvelopeData, Envelope, EnvelopeData } from "./graph/envelope";
import {
  defaultOscillatorData,
  Oscillator,
  OscillatorData,
} from "./graph/oscillator";
import { defaultSinkData, Sink, SinkData } from "./graph/sink";
import { Button } from "./graph/button";
import { Sequencer, defaultSequencerData } from "./graph/sequencer";

type StoreData = {
  rfNodes: Node[];
  rfEdges: Edge[];
  graphNodes: Map<string, GraphNode<unknown>>;
  reconnectFinished: boolean;
};

type StoreActions = {
  onNodesChange: OnNodesChange;
  onNodesDelete: OnNodesDelete;
  addNode: (type: string, position: XYPosition) => void;
  onEdgesChange: OnEdgesChange;
  onEdgeUpdate: OnEdgeUpdateFunc;
  onEdgeUpdateStart: () => void;
  onEdgeUpdateEnd: (event: unknown, edge: Edge) => void;
  modifyEdge: (
    connection: Connection | Edge,
    action: "connect" | "disconnect"
  ) => void;
  getGraphNode: <T>(id: string) => T;
  updateNodeData: <T>(id: string, data: Partial<T>) => void;
  restoreGraph: (nodes: Node[], edges: Edge[]) => void;
};

export type Store = StoreData & StoreActions;

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

enum NodeTypes {
  Oscillator = "oscillator",
  Sink = "sink",
  Envelope = "envelope",
  Button = "button",
  Sequencer = "sequencer",
}

export type NodeInfo = {
  type: NodeTypes;
  label: string;
  defaultData: unknown;
  createGraphNode: (data: unknown) => GraphNode<unknown>;
};

export const nodeDefinitions: Record<NodeTypes, NodeInfo> = {
  [NodeTypes.Oscillator]: {
    type: NodeTypes.Oscillator,
    label: "Oscillator",
    defaultData: defaultOscillatorData,
    createGraphNode: (data) => new Oscillator(data as OscillatorData),
  },
  [NodeTypes.Sink]: {
    type: NodeTypes.Sink,
    label: "Sink",
    defaultData: defaultSinkData,
    createGraphNode: (data) => new Sink(data as SinkData),
  },
  [NodeTypes.Envelope]: {
    type: NodeTypes.Envelope,
    label: "Envelope",
    defaultData: defaultEnvelopeData,
    createGraphNode: (data) => new Envelope(data as EnvelopeData),
  },
  [NodeTypes.Button]: {
    type: NodeTypes.Button,
    label: "Button",
    defaultData: {},
    createGraphNode: () => new Button(),
  },
  [NodeTypes.Sequencer]: {
    type: NodeTypes.Sequencer,
    label: "Sequencer",
    defaultData: defaultSequencerData,
    createGraphNode: () => new Sequencer(),
  },
};

const createFlowNode = <TData>(
  id: string,
  type: NodeTypes,
  position: XYPosition,
  data: TData
): Node => ({
  id,
  type,
  position,
  data,
});

const useStore = create<Store>((set, get) => ({
  // state
  rfNodes: initialNodes,
  rfEdges: initialEdges,
  graphNodes: new Map(),
  reconnectFinished: false,

  // actions
  onNodesChange: (changes) => {
    set({
      rfNodes: applyNodeChanges(changes, get().rfNodes),
    });
  },
  onNodesDelete: (nodes) => {
    nodes.forEach((node) => {
      const graphNode = get().graphNodes.get(node.id);
      if (graphNode) {
        graphNode.dispose();
      }
    });
  },
  addNode: (type, position) => {
    const nodeInfo = nodeDefinitions[type as NodeTypes];
    if (nodeInfo) {
      const id = nanoid();
      const flowNode = createFlowNode(
        id,
        nodeInfo.type,
        position,
        nodeInfo.defaultData
      );
      const graphNode = nodeInfo.createGraphNode(nodeInfo.defaultData);

      set((state) => {
        const newGraphNodes = new Map(state.graphNodes);
        newGraphNodes.set(id, graphNode);
        return {
          rfNodes: [...state.rfNodes, flowNode],
          graphNodes: newGraphNodes,
        };
      });
    }
  },
  onEdgesChange: (changes) => {
    set({
      rfEdges: applyEdgeChanges(changes, get().rfEdges),
    });
  },
  onEdgeUpdate: (oldEdge, newConnection) => {
    get().modifyEdge(oldEdge, "disconnect");
    get().modifyEdge(newConnection, "connect");
    set({
      reconnectFinished: true,
    });
  },
  onEdgeUpdateStart: () => {
    set({ reconnectFinished: false });
  },
  onEdgeUpdateEnd: (_, edge) => {
    if (get().reconnectFinished) {
      return;
    }

    get().modifyEdge(edge, "disconnect");
    set({ reconnectFinished: true });
  },
  modifyEdge: (connection, action) => {
    if (
      !connection.source ||
      !connection.target ||
      !connection.sourceHandle ||
      !connection.targetHandle
    ) {
      return;
    }

    const sourceNode = get().graphNodes.get(connection.source);
    const targetNode = get().graphNodes.get(connection.target);

    if (!sourceNode || !targetNode) {
      return;
    }

    const sourceHandleId = connection.sourceHandle?.split("/")[1];
    const targetHandleId = connection.targetHandle?.split("/")[1];

    const sourceConnectable = sourceNode.getConnectable(sourceHandleId || "");
    const targetConnectable = targetNode.getConnectable(targetHandleId || "");

    if (!sourceConnectable || !targetConnectable) {
      return;
    }

    if (action == "connect") {
      connect(sourceConnectable, targetConnectable);
      set({
        rfEdges: addEdge(connection, get().rfEdges),
      });
    } else if (action == "disconnect" && "id" in connection) {
      disconnect(sourceConnectable, targetConnectable);
      set({
        rfEdges: get().rfEdges.filter((edge) => edge.id !== connection.id),
      });
    }
  },
  getGraphNode: <T>(id: string) => {
    const graphNode = get().graphNodes.get(id);
    return graphNode as T;
  },
  updateNodeData: <T>(id: string, data: Partial<T>) => {
    const node = get().rfNodes.find((node) => node.id === id);
    if (!node) {
      return;
    }

    const newData = { ...node.data, ...data };
    const graphNode = get().graphNodes.get(id);
    if (!graphNode) {
      return;
    }

    graphNode.update(newData);
    set((state) => ({
      rfNodes: state.rfNodes.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      ),
    }));
  },
  restoreGraph: (nodes, edges) => {
    // TODO: dispose existing graph nodes
    set({
      rfNodes: nodes,
      rfEdges: edges,
      graphNodes: new Map(),
    });

    // add all nodes and their graph nodes
    nodes.forEach((node) => {
      const nodeInfo = nodeDefinitions[node.type as NodeTypes];
      if (nodeInfo) {
        const graphNode = nodeInfo.createGraphNode(node.data);
        set((state) => {
          const newGraphNodes = new Map(state.graphNodes);
          newGraphNodes.set(node.id, graphNode);
          return {
            graphNodes: newGraphNodes,
            rfNodes: [...state.rfNodes, node],
          };
        });
      }
    });

    edges.forEach((edge) => {
      get().modifyEdge(edge, "connect");
    });
  },
}));

export { useStore, NodeTypes };
