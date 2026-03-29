"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info, Trash2, Lightbulb, ChevronDown, ChevronRight, CheckSquare } from "lucide-react";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import { getProblemById } from "@/data/problems";
import { SimulationControls } from "./SimulationControls";
import { MetricsDisplay } from "./MetricsDisplay";
import { ScoreReport } from "./ScoreReport";
import { CapacityCalculator } from "./CapacityCalculator";

interface RightPanelProps {
  open: boolean;
  onSimulate: () => void;
}

export function RightPanel({ open, onSimulate }: RightPanelProps) {
  const activeRightTab = useAppStore((s) => s.activeRightTab);
  const setActiveRightTab = useAppStore((s) => s.setActiveRightTab);

  return (
    <aside
      className={`flex shrink-0 flex-col border-l border-zinc-800 bg-zinc-900 overflow-hidden transition-all duration-200 ${
        open ? "w-[300px] opacity-100" : "w-0 opacity-0 border-l-0"
      }`}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      <div className="flex w-[300px] flex-1 flex-col">
        <Tabs value={activeRightTab} onValueChange={(v) => setActiveRightTab(v as typeof activeRightTab)} className="flex flex-1 flex-col">
          <TabsList className="mx-2 mt-2 h-8 w-auto shrink-0 bg-zinc-800">
            <TabsTrigger
              value="properties"
              className="h-7 px-3 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="h-7 px-3 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              Simulate
            </TabsTrigger>
            <TabsTrigger
              value="score"
              className="h-7 px-3 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              Score
            </TabsTrigger>
            <TabsTrigger
              value="capacity"
              className="h-7 px-3 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100"
            >
              Capacity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3">
                <PropertiesTab />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="simulation" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-4">
                <SimulationControls onSimulate={onSimulate} />
                <Separator className="bg-zinc-800" />
                <MetricsDisplay />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="score" className="mt-0 flex-1 overflow-hidden">
            <div className="h-full p-3">
              <ScoreReport />
            </div>
          </TabsContent>

          <TabsContent value="capacity" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3">
                <CapacityCalculator />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

function PropertiesTab() {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) as
    | (typeof nodes[number] & { data: ComponentNodeData })
    | undefined;
  const problem = getProblemById(selectedProblemId);

  return (
    <div className="space-y-4">
      {/* Problem requirements */}
      {problem && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Requirements — {problem.title}
          </p>
          <div className="space-y-1.5">
            {[
              { label: "Reads/sec", value: problem.requirements.readsPerSec.toLocaleString() },
              { label: "Writes/sec", value: problem.requirements.writesPerSec.toLocaleString() },
              { label: "Storage", value: `${problem.requirements.storageGB} GB` },
              { label: "Latency SLA", value: `< ${problem.requirements.latencyMs}ms` },
              { label: "Users", value: problem.requirements.users },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-md bg-zinc-800 px-2.5 py-1.5"
              >
                <span className="text-xs text-zinc-400">{item.label}</span>
                <span className="font-mono text-xs text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem && problem.constraints.length > 0 && (
        <>
          <Separator className="bg-zinc-800" />
          <ConstraintsSection constraints={problem.constraints} />
        </>
      )}

      {/* Hints */}
      {problem && problem.hints.length > 0 && (
        <>
          <Separator className="bg-zinc-800" />
          <HintsSection hints={problem.hints} />
        </>
      )}

      <Separator className="bg-zinc-800" />

      {/* Selected node properties */}
      {selectedNode && selectedNode.type === "text" ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Text Annotation
          </p>
          <div className="space-y-2">
            <div className="rounded-md bg-zinc-800 px-3 py-2">
              <p className="text-xs font-medium text-zinc-200">
                Text Note
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Double-click on canvas to edit
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full gap-1.5 border-zinc-700 text-rose-400 hover:bg-zinc-800 hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove Note
            </Button>
          </div>
        </div>
      ) : selectedNode ? (
        (() => {
          const data = selectedNode.data as ComponentNodeData;
          return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Component Properties
          </p>

          <div className="space-y-2">
            <div className="rounded-md bg-zinc-800 px-3 py-2">
              <p className="text-xs font-medium text-zinc-200">
                {data.label as string}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {data.category as string} · Max {(data.maxQPS as number) === Infinity ? "\u221e" : (data.maxQPS as number).toLocaleString()} QPS
              </p>
            </div>

            {/* Replicas slider */}
            {data.scalable && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs text-zinc-400">Replicas</label>
                  <span className="font-mono text-xs text-cyan-500">
                    {data.replicas as number}
                  </span>
                </div>
                <Slider
                  aria-label="Replicas"
                  value={[data.replicas as number]}
                  onValueChange={(v) =>
                    updateNodeData(selectedNode.id, { replicas: Array.isArray(v) ? v[0] : v })
                  }
                  min={1}
                  max={20}
                  step={1}
                  className=""
                />
                <p className="mt-1 text-[11px] text-zinc-400">
                  Effective capacity: {(((data.maxQPS as number) === Infinity ? Infinity : (data.maxQPS as number) * (data.replicas as number))).toLocaleString()} QPS
                </p>
              </div>
            )}

            {/* Info */}
            <div className="space-y-1">
              {[
                { label: "Base Latency", value: `${data.latencyMs}ms` },
                { label: "Scalable", value: data.scalable ? "Yes" : "No" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-zinc-300">{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full gap-1.5 border-zinc-700 text-rose-400 hover:bg-zinc-800 hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove Component
            </Button>
          </div>
        </div>
          );
        })()
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
            <Info className="h-4 w-4 text-zinc-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400">
              No component selected
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Click a component on the canvas to edit its properties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConstraintsSection({ constraints }: { constraints: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? constraints : constraints.slice(0, 3);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Constraints
      </p>
      <div className="space-y-1.5">
        {shown.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckSquare className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
            <span className="text-xs leading-relaxed text-zinc-400">{c}</span>
          </div>
        ))}
      </div>
      {constraints.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-cyan-500 transition-colors hover:text-cyan-400"
        >
          {expanded ? (
            <>
              <ChevronDown className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronRight className="h-3 w-3" />
              Show {constraints.length - 3} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

function HintsSection({ hints }: { hints: { title: string; content: string }[] }) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());

  const toggleHint = (index: number) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Hints
      </p>
      <div className="space-y-1.5">
        {hints.map((hint, i) => (
          <div
            key={i}
            className="rounded-md border border-zinc-700 bg-zinc-800 overflow-hidden"
          >
            <button
              onClick={() => toggleHint(i)}
              className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
            >
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="flex-1 text-xs font-medium text-zinc-300">
                {hint.title}
              </span>
              {expandedHints.has(i) ? (
                <ChevronDown className="h-3 w-3 shrink-0 text-zinc-500" />
              ) : (
                <ChevronRight className="h-3 w-3 shrink-0 text-zinc-500" />
              )}
            </button>
            {expandedHints.has(i) && (
              <div className="border-t border-zinc-700 px-2.5 py-2">
                <p className="text-xs leading-relaxed text-zinc-400">
                  {hint.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
