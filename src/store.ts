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
  OnEdgesDelete,
} from "reactflow";
import { create } from "zustand";
import { GraphNode, connect, disconnect } from "./nodes/util/graph";
import { NodeType, NODE_DEFINITIONS } from "./nodes";

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
  onEdgesDelete: OnEdgesDelete;
  onEdgeUpdateStart: () => void;
  onEdgeUpdateEnd: (event: unknown, edge: Edge) => void;
  modifyEdge: (
    connection: Connection | Edge,
    action: "connect" | "disconnect"
  ) => void;
  getGraphNode: <T extends GraphNode<unknown>>(id: string) => T;
  updateNodeData: <T>(id: string, data: Partial<T>) => void;
  restoreGraph: (nodes: Node[], edges: Edge[]) => void;
};

type Store = StoreData & StoreActions;

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const createFlowNode = <TData>(
  id: string,
  type: NodeType,
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
    const nodeInfo = NODE_DEFINITIONS[type as NodeType];
    if (nodeInfo) {
      const id = nanoid();
      const flowNode = createFlowNode(
        id,
        nodeInfo.type,
        position,
        nodeInfo.defaultData
      );
      const graphNode = nodeInfo.createGraphNode(id, nodeInfo.defaultData);

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
  onEdgesDelete: (edges) => {
    edges.forEach((edge) => {
      get().modifyEdge(edge, "disconnect");
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
      console.log("connecting", sourceConnectable, targetConnectable);
      if (connect(sourceConnectable, targetConnectable)) {
        set({
          rfEdges: addEdge(connection, get().rfEdges),
        });
      }
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
      const nodeInfo = NODE_DEFINITIONS[node.type as NodeType];
      if (nodeInfo) {
        const graphNode = nodeInfo.createGraphNode(node.id, node.data);
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

export {
  useStore,
  NodeType as NodeTypes,
  NODE_DEFINITIONS as nodeDefinitions,
  type Store,
};
