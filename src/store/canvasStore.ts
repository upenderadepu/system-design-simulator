import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

export interface ComponentNodeData {
  componentId: string;
  label: string;
  icon: string;
  category: string;
  replicas: number;
  maxQPS: number;
  latencyMs: number;
  scalable: boolean;
  utilization?: number;
  status?: string;
  isBottleneck?: boolean;
  // ReactFlow v12 requires an index signature on custom node data types
  [key: string]: unknown;
}

export interface TextNodeData {
  text: string;
  fontSize?: "sm" | "base" | "lg";
  [key: string]: unknown;
}

export interface CustomEdgeData {
  label?: string;
  protocol?: 'http' | 'grpc' | 'websocket' | 'pubsub' | 'tcp' | 'custom';
  async?: boolean;
  [key: string]: unknown;
}

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<ComponentNodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<CustomEdgeData>) => void;
  updateAllNodeData: (
    updates: Map<string, Partial<ComponentNodeData>>
  ) => void;
  clearCanvas: () => void;
  deleteNode: (nodeId: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, _get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,

      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as Node[],
        }));
      },
      onEdgesChange: (changes) => {
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
      },
      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(
            { ...connection, type: "animated", data: { label: '', protocol: 'http', async: false } satisfies CustomEdgeData },
            state.edges
          ),
        }));
      },
      addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }));
      },
      setSelectedNode: (id) => {
        set({ selectedNodeId: id, selectedEdgeId: null });
      },
      setSelectedEdge: (id) => {
        set({ selectedEdgeId: id, selectedNodeId: null });
      },
      updateNodeData: (nodeId, data) => {
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        }));
      },
      updateEdgeData: (edgeId, data) => {
        set((state) => ({
          edges: state.edges.map((e) =>
            e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
          ),
        }));
      },
      updateAllNodeData: (updates) => {
        set((state) => ({
          nodes: state.nodes.map((n) => {
            const update = updates.get(n.id);
            return update ? { ...n, data: { ...n.data, ...update } } : n;
          }),
        }));
      },
      clearCanvas: () => {
        set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null });
      },
      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        }));
      },
    }),
    {
      name: "systemsim-canvas",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);
