"use client";

import { type DragEvent, useCallback, useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SYSTEM_COMPONENTS,
  COMPONENT_CATEGORIES,
  getComponentById,
} from "@/data/components";
import { CONCEPT_LIBRARY } from "@/data/conceptLibrary";
import { Server, GripVertical, Plus, Search as SearchIcon } from "lucide-react";
import { ICON_MAP } from "@/lib/icons";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";

const CATEGORY_ACCENT: Record<string, string> = {
  networking: "text-blue-400",
  compute: "text-violet-400",
  storage: "text-amber-400",
  messaging: "text-emerald-400",
  infrastructure: "text-cyan-400",
};

const CATEGORY_BG: Record<string, string> = {
  networking: "bg-blue-400/10",
  compute: "bg-violet-400/10",
  storage: "bg-amber-400/10",
  messaging: "bg-emerald-400/10",
  infrastructure: "bg-cyan-400/10",
};

const CATEGORY_BORDER: Record<string, string> = {
  networking: "border-l-blue-400",
  compute: "border-l-violet-400",
  storage: "border-l-amber-400",
  messaging: "border-l-emerald-400",
  infrastructure: "border-l-cyan-400",
};

export function ComponentPalette() {
  const [search, setSearch] = useState("");
  const { getViewport } = useReactFlow();
  const addNode = useCanvasStore((s) => s.addNode);

  function handleDragStart(e: DragEvent, componentId: string) {
    e.dataTransfer.setData("application/systemsim-component", componentId);
    e.dataTransfer.effectAllowed = "copy";

    const ghost = document.createElement("div");
    ghost.style.cssText = "position:absolute;top:-1000px;left:-1000px;padding:6px 12px;background:#18181b;border:1px solid #3f3f46;border-radius:8px;color:#e4e4e7;font-size:12px;font-family:system-ui;white-space:nowrap;";
    const comp = SYSTEM_COMPONENTS.find((c) => c.id === componentId);
    ghost.textContent = comp?.label ?? componentId;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }

  /** Tap-to-add: place the component at the canvas viewport center. */
  const handleQuickAdd = useCallback(
    (componentId: string) => {
      const component = getComponentById(componentId);
      if (!component) return;

      const { x, y, zoom } = getViewport();
      // Jitter the center so repeated taps don't stack exactly on top
      const jitter = () => (Math.random() - 0.5) * 60;
      const centerX = (-x + window.innerWidth / 2) / zoom + jitter();
      const centerY = (-y + window.innerHeight / 2) / zoom + jitter();

      const newNode: Node<ComponentNodeData> = {
        id: `${componentId}-${crypto.randomUUID()}`,
        type: "component",
        position: { x: centerX, y: centerY },
        data: {
          componentId: component.id,
          label: component.label,
          icon: component.icon,
          category: component.category,
          replicas: 1,
          maxQPS: component.maxQPS,
          latencyMs: component.latencyMs,
          scalable: component.scalable,
        },
      };
      addNode(newNode);
      useAppStore.getState().showToast(`Added ${component.label}`, "success");
    },
    [getViewport, addNode]
  );

  const query = search.toLowerCase().trim();

  const totalMatches = query
    ? SYSTEM_COMPONENTS.filter((c) => c.label.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)).length
    : SYSTEM_COMPONENTS.length;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            aria-label="Search components"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-8 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none transition-colors focus:border-cyan-500"
          />
        </div>
        {query && (
          <p className="mt-1.5 text-[10px] text-zinc-500">
            {totalMatches === 0
              ? "No matches"
              : `${totalMatches} component${totalMatches === 1 ? "" : "s"} match "${search}"`}
          </p>
        )}
      </div>
      <ScrollArea className="flex-1">
      <div className="space-y-4 p-3">
        {COMPONENT_CATEGORIES.map((cat) => {
          const items = SYSTEM_COMPONENTS.filter(
            (c) => c.category === cat.key && (query === "" || c.label.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
          );
          if (query !== "" && items.length === 0) return null;
          return (
            <div key={cat.key}>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  {cat.label}
                </p>
                <span className="flex h-4 min-w-4 items-center justify-center rounded bg-zinc-800 px-1 text-[10px] font-medium tabular-nums text-zinc-500">
                  {items.length}
                </span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <TooltipProvider>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? Server;
                  const accent = CATEGORY_ACCENT[item.category] ?? "text-cyan-400";
                  const iconBg = CATEGORY_BG[item.category] ?? "bg-cyan-400/10";
                  const borderColor = CATEGORY_BORDER[item.category] ?? "border-l-cyan-400";
                  const concept = CONCEPT_LIBRARY[item.id];
                  const tipText = concept?.whenToUse[0] ?? item.description;
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger
                        render={
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            className={`group flex cursor-grab items-center gap-2 rounded-md border-l-2 px-2 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 active:cursor-grabbing ${borderColor}`}
                          >
                            <GripVertical className="h-3 w-3 shrink-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
                              <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${accent}`} />
                            </div>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            <span className="shrink-0 text-[11px] text-zinc-400">
                              {item.maxQPS === Infinity ? "\u221e" : `${(item.maxQPS / 1000).toFixed(0)}k`}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAdd(item.id);
                              }}
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-zinc-500 opacity-60 transition-all hover:bg-zinc-700 hover:text-cyan-400 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                              title="Add to canvas"
                              aria-label={`Add ${item.label} to canvas`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        }
                      />
                      <TooltipContent side="right" sideOffset={8} className="max-w-[220px]">
                        <p className="text-xs leading-relaxed">{tipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </ScrollArea>
    </div>
  );
}
