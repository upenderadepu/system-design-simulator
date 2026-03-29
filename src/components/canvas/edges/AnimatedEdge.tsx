"use client";

import { memo } from "react";
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { useSimulationStore } from "@/store/simulationStore";

function AnimatedEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  const isRunning = useSimulationStore((s) => s.isRunning);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isRunning ? "rgb(6, 182, 212)" : "rgb(82, 82, 91)",
          strokeWidth: 1.5,
        }}
      />
      {/* Animated dots — only render when simulation is running */}
      {isRunning && (
        <>
          <circle r="2" fill="rgb(6, 182, 212)" opacity="0.8">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle r="1.5" fill="rgb(6, 182, 212)" opacity="0.4">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
              begin="0.7s"
            />
          </circle>
        </>
      )}
    </g>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeInner);
