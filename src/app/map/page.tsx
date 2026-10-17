"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nodes, Node, nodeConnections } from "@/data/nodes";
import {
  X,
  MapPin,
  Music,
  Flame,
  Navigation,
  Crosshair,
  Menu,
  Sparkles,
  Plus,
  Minus,
  Maximize2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  const padX = w * 0.06;
  const padY = h * 0.1;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;
  const x = padX + ((lng + 180) / 360) * usableW;
  const y = padY + ((90 - lat) / 180) * usableH;
  return { x, y };
}

/* ------------------------------------------------------------------ */
/*  Starfield Canvas                                                   */
/* ------------------------------------------------------------------ */

function StarfieldCanvas({
  width,
  height,
  mouseRef,
}: {
  width: number;
  height: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.floor((width * height) / 800);
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 3 + 0.5,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const nebulae = [
      { x: width * 0.2, y: height * 0.3, r: Math.min(width, height) * 0.4, color: "rgba(99,102,241,0.03)" },
      { x: width * 0.7, y: height * 0.6, r: Math.min(width, height) * 0.35, color: "rgba(212,168,83,0.025)" },
      { x: width * 0.5, y: height * 0.2, r: Math.min(width, height) * 0.3, color: "rgba(34,197,94,0.02)" },
      { x: width * 0.85, y: height * 0.4, r: Math.min(width, height) * 0.25, color: "rgba(167,139,250,0.025)" },
    ];

    let animId: number;
    const startTime = Date.now();
    let mouse = { x: width / 2, y: height / 2 };
    let targetMouse = { x: width / 2, y: height / 2 };

    function draw() {
      if (!ctx) return;
      const elapsed = (Date.now() - startTime) / 1000;

      const m = mouseRef.current;
      if (m) {
        targetMouse.x = m.x;
        targetMouse.y = m.y;
      }
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      ctx.fillStyle = "#05050d";
      ctx.fillRect(0, 0, width, height);

      nebulae.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      stars.forEach((s) => {
        const parallaxX = (mouse.x - width / 2) * 0.02 * s.z;
        const parallaxY = (mouse.y - height / 2) * 0.02 * s.z;
        const twinkle = Math.sin(elapsed * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * twinkle})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [width, height, mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="absolute inset-0"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Constellation SVG Layer                                            */
/* ------------------------------------------------------------------ */

function ConstellationSVG({
  width,
  height,
  nodePositions,
  activeNodeId,
  flashNodeId,
  onNodeClick,
}: {
  width: number;
  height: number;
  nodePositions: Map<string, { x: number; y: number }>;
  activeNodeId: string | null;
  flashNodeId: string | null;
  onNodeClick: (id: string) => void;
}) {
  const connections = useMemo(() => {
    return nodeConnections
      .map((conn) => {
        const from = nodePositions.get(conn.from);
        const to = nodePositions.get(conn.to);
        if (!from || !to) return null;
        return { ...conn, x1: from.x, y1: from.y, x2: to.x, y2: to.y };
      })
      .filter(Boolean) as {
      from: string;
      to: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[];
  }, [nodePositions]);

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,168,83,0.3)" />
          <stop offset="50%" stopColor="rgba(212,168,83,0.6)" />
          <stop offset="100%" stopColor="rgba(212,168,83,0.3)" />
        </linearGradient>
        <style>{`
          @keyframes dashFlow {
            to { stroke-dashoffset: -200; }
          }
          @keyframes nodePulse {
            0%, 100% { r: 5; opacity: 0.8; }
            50% { r: 7; opacity: 1; }
          }
          @keyframes ringExpand {
            0% { r: 5; opacity: 0.6; }
            100% { r: 22; opacity: 0; }
          }
          @keyframes flashBright {
            0% { filter: brightness(1); }
            50% { filter: brightness(2.5); }
            100% { filter: brightness(1); }
          }
        `}</style>
      </defs>

      {/* Grid lines */}
      <g stroke="rgba(255,255,255,0.025)" strokeWidth="0.3">
        {Array.from({ length: 11 }, (_, i) => {
          const x = (i / 10) * width;
          return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={height} />;
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const y = (i / 6) * height;
          return <line key={`h${i}`} x1={0} y1={y} x2={width} y2={y} />;
        })}
      </g>

      {/* Connection lines */}
      <g>
        {connections.map((conn, i) => (
          <line
            key={`${conn.from}-${conn.to}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="url(#line-gradient)"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            opacity={
              activeNodeId && (conn.from === activeNodeId || conn.to === activeNodeId)
                ? 0.6
                : 0.3
            }
            style={{
              animation: `dashFlow 20s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;
          const isActive = node.id === activeNodeId;
          const isFlash = node.id === flashNodeId;

          return (
            <g
              key={node.id}
              className="node-marker"
              style={{
                pointerEvents: "all",
                cursor: "pointer",
                animation: isFlash ? "flashBright 0.6s ease" : "none",
              }}
              onClick={() => onNodeClick(node.id)}
            >
              {node.status === "active" && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.5"
                  opacity="0.3"
                  style={{ animation: "ringExpand 3s ease-out infinite" }}
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 16 : node.status === "active" ? 12 : 8}
                fill={node.color}
                opacity={isActive ? 0.12 : 0.06}
                filter="url(#glow)"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 7 : node.status === "active" ? 5 : 3.5}
                fill={node.color}
                filter="url(#glow-strong)"
                style={
                  node.status === "active"
                    ? { animation: "nodePulse 3s ease-in-out infinite" }
                    : undefined
                }
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 11 : node.status === "active" ? 8 : 5}
                fill="none"
                stroke={node.color}
                strokeWidth="0.6"
                opacity="0.4"
                strokeDasharray="2 3"
              />
              <text
                x={pos.x}
                y={pos.y + (node.status === "active" ? 22 : 16)}
                textAnchor="middle"
                fill={isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)"}
                fontSize={node.status === "active" ? "9" : "7"}
                fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
                letterSpacing="0.05em"
                style={{ pointerEvents: "none" }}
              >
                {node.name.toUpperCase()}
              </text>
              <text
                x={pos.x}
                y={pos.y + (node.status === "active" ? 32 : 24)}
                textAnchor="middle"
                fill={node.color}
                fontSize={node.status === "active" ? "8" : "6"}
                fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
                opacity="0.5"
                style={{ pointerEvents: "none" }}
              >
                {node.hz} Hz
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Scanlines Overlay                                                  */
/* ------------------------------------------------------------------ */

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{
        background:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Panel                                                       */
/* ------------------------------------------------------------------ */

function DetailPanel({
  node,
  onClose,
  onFocus,
}: {
  node: Node;
  onClose: () => void;
  onFocus: () => void;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    node.location
  )}`;

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-50 h-full w-full sm:w-[380px] border-l border-[rgba(255,255,255,0.08)] bg-[rgba(10,11,15,0.92)] backdrop-blur-xl"
    >
      <div className="flex h-full flex-col overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full" style={{ color: node.color }}>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
            style={{
              background: `${node.color}15`,
              border: `1px solid ${node.color}40`,
              boxShadow: `0 0 20px ${node.color}20`,
            }}
          >
            {node.emoji}
          </div>
          <div
            className="absolute h-16 w-16 rounded-full"
            style={{
              border: `1px solid ${node.color}30`,
              animation: "halo-pulse 3s ease-in-out infinite",
            }}
          />
        </div>

        <style jsx>{`
          @keyframes halo-pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0.1; }
          }
        `}</style>

        <h2 className="mt-4 text-center text-xl font-light tracking-wide text-white">
          {node.name}
        </h2>
        <p className="mt-1 text-center text-xs text-[rgba(255,255,255,0.4)]">
          {node.location}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3 text-center">
            <p className="text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.3)]">
              Frequency
            </p>
            <p className="mt-1 text-sm font-light" style={{ color: node.color }}>
              {node.hz} Hz
            </p>
          </div>
          <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3 text-center">
            <p className="text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.3)]">
              Chakra
            </p>
            <p className="mt-1 text-sm font-light text-white">{node.freqName}</p>
          </div>
          <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3 text-center">
            <p className="text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.3)]">
              Crystal
            </p>
            <p className="mt-1 text-sm font-light text-white">{node.crystals[0]}</p>
          </div>
          <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3 text-center">
            <p className="text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.3)]">
              Status
            </p>
            <p
              className="mt-1 text-sm font-light"
              style={{
                color: node.status === "active" ? "#22c55e" : "#d4a853",
              }}
            >
              {node.status === "active" ? "Activated" : "Awaiting"}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-4">
          <p className="text-xs leading-relaxed italic text-[rgba(255,255,255,0.45)]">
            &ldquo;{node.narrative}&rdquo;
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[rgba(255,255,255,0.35)]">
          {node.description}
        </p>

        <p className="mt-3 text-xs italic" style={{ color: node.color }}>
          &ldquo;{node.guardianPhrase}&rdquo;
        </p>

        <div className="mt-auto pt-6 flex flex-col gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#d4a853] px-4 py-3 text-xs font-medium tracking-wider uppercase text-[#0a0b0f] transition-colors hover:bg-[#e8b858]"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <button
            onClick={onFocus}
            className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-xs font-medium tracking-wider uppercase text-[rgba(255,255,255,0.6)] transition-all hover:border-[rgba(212,168,83,0.3)] hover:text-[#d4a853]"
          >
            <Crosshair className="h-4 w-4" />
            Focus on Map
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function Sidebar({
  nodesList,
  activeId,
  onSelect,
  onClose,
}: {
  nodesList: Node[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const activeNodes = nodesList.filter((n) => n.status === "active");
  const futureNodes = nodesList.filter((n) => n.status === "future");

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 z-40 h-full w-[280px] border-r border-[rgba(255,255,255,0.07)] bg-[rgba(10,11,15,0.85)] backdrop-blur-xl sm:z-auto sm:relative sm:h-auto sm:w-64 sm:border-r-0 sm:bg-transparent sm:backdrop-blur-none"
    >
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-medium tracking-widest uppercase text-[rgba(255,255,255,0.3)]">
            Node Constellation
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[rgba(255,255,255,0.3)] hover:text-white sm:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
          <p className="px-2 text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.25)]">
            Active Nodes &middot; {activeNodes.length}
          </p>
          {activeNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onSelect(node.id)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors ${
                activeId === node.id
                  ? "border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.08)]"
                  : "hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: node.color,
                  boxShadow: `0 0 8px ${node.color}`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className={`text-xs truncate ${activeId === node.id ? "text-white" : "text-[rgba(255,255,255,0.7)]"}`}>
                  {node.name}
                </div>
                <div className="text-[9px] text-[rgba(255,255,255,0.3)] truncate">
                  {node.location} &middot; {node.hz} Hz
                </div>
              </div>
              <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                Active
              </span>
            </button>
          ))}

          {futureNodes.length > 0 && (
            <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-3">
              <p className="px-2 text-[9px] tracking-widest uppercase text-[rgba(255,255,255,0.25)]">
                Future Nodes &middot; {futureNodes.length}
              </p>
              <div className="mt-1 space-y-1">
                {futureNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => onSelect(node.id)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors ${
                      activeId === node.id
                        ? "border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.08)]"
                        : "hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full border"
                      style={{
                        borderColor: `${node.color}60`,
                        background: "transparent",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs truncate ${activeId === node.id ? "text-white" : "text-[rgba(255,255,255,0.5)]"}`}>
                        {node.name}
                      </div>
                      <div className="text-[9px] text-[rgba(255,255,255,0.25)] truncate">
                        {node.location} &middot; {node.hz} Hz
                      </div>
                    </div>
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider" style={{ background: "rgba(212,168,83,0.08)", color: "#d4a853", border: "1px solid rgba(212,168,83,0.15)" }}>
                      Future
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-3">
          <p className="px-2 text-[9px] leading-relaxed text-[rgba(255,255,255,0.25)]">
            {activeNodes.length} active, {futureNodes.length} future nodes across the Earth grid.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Bottom Sheet                                                */
/* ------------------------------------------------------------------ */

function MobileBottomSheet({
  node,
  onClose,
}: {
  node: Node;
  onClose: () => void;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    node.location
  )}`;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-[rgba(255,255,255,0.1)] bg-[rgba(10,11,15,0.98)] backdrop-blur-xl sm:hidden"
    >
      <div className="p-5">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[rgba(255,255,255,0.15)]" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{
                background: `${node.color}15`,
                border: `1px solid ${node.color}40`,
              }}
            >
              {node.emoji}
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: node.color }}>
                {node.category} Node
              </span>
              <h3 className="text-lg font-medium text-white">{node.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[rgba(255,255,255,0.3)] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[rgba(255,255,255,0.35)]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" style={{ color: node.color }} />
            {node.location}
          </span>
          <span className="flex items-center gap-1">
            <Music className="h-3 w-3" style={{ color: node.color }} />
            {node.hz} Hz &middot; {node.freqName}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3 w-3" style={{ color: node.color }} />
            {node.element}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[rgba(255,255,255,0.45)]">
          {node.narrative}
        </p>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4a853] px-4 py-3 text-xs font-medium tracking-wider uppercase text-[#0a0b0f]"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-30 flex gap-3 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(10,11,15,0.8)] backdrop-blur-md px-3 py-2">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
        <span className="text-[9px] tracking-wider uppercase text-[rgba(255,255,255,0.35)]">Active</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a853]" style={{ boxShadow: "0 0 6px #d4a853" }} />
        <span className="text-[9px] tracking-wider uppercase text-[rgba(255,255,255,0.35)]">Future</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.2)]" />
        <span className="text-[9px] tracking-wider uppercase text-[rgba(255,255,255,0.35)]">Connection</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Zoom Controls                                                      */
/* ------------------------------------------------------------------ */

function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  scale,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}) {
  return (
    <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(10,11,15,0.8)] backdrop-blur-md p-1">
      <button
        onClick={onZoomIn}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[rgba(255,255,255,0.5)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
        title="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="flex h-6 items-center justify-center text-[9px] text-[rgba(255,255,255,0.3)]">
        {Math.round(scale * 100)}%
      </div>
      <button
        onClick={onZoomOut}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[rgba(255,255,255,0.5)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
        title="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        onClick={onReset}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[rgba(255,255,255,0.5)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
        title="Reset view"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Map Page                                                      */
/* ------------------------------------------------------------------ */

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dims, setDims] = useState({ width: 1200, height: 800 });
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashNodeId, setFlashNodeId] = useState<string | null>(null);

  /* Transform state for zoom & pan */
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, transformX: 0, transformY: 0 });
  const minScale = 0.5;
  const maxScale = 4;

  /* Measure container */
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ width: rect.width, height: rect.height });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Track mouse for parallax */
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Compute node positions */
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    nodes.forEach((node) => {
      if (node.coordinates) {
        const pos = latLngToXY(
          node.coordinates.lat,
          node.coordinates.lng,
          dims.width,
          dims.height
        );
        map.set(node.id, pos);
      }
    });
    return map;
  }, [dims]);

  const activeNode = useMemo(
    () => nodes.find((n) => n.id === activeNodeId) || null,
    [activeNodeId]
  );

  /* Zoom */
  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, maxScale),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, minScale),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  /* Wheel zoom */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setTransform((prev) => {
        const newScale = Math.min(Math.max(prev.scale * delta, minScale), maxScale);
        return { ...prev, scale: newScale };
      });
    },
    []
  );

  /* Pan */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // Don't start drag if clicking on a node, button, or interactive element
    const target = e.target as HTMLElement;
    if (
      target.closest(".node-marker") ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']") ||
      target.tagName === "circle" ||
      target.tagName === "text" ||
      target.tagName === "g"
    ) {
      return;
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      transformX: transform.x,
      transformY: transform.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTransform((prev) => ({
        ...prev,
        x: dragStart.current.transformX + dx,
        y: dragStart.current.transformY + dy,
      }));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* Focus on node: center and zoom */
  const handleFocus = useCallback(() => {
    if (!activeNodeId) return;
    const pos = nodePositions.get(activeNodeId);
    if (!pos || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const targetScale = 2;
    const targetX = rect.width / 2 - pos.x * targetScale;
    const targetY = rect.height / 2 - pos.y * targetScale;

    setTransform({ x: targetX, y: targetY, scale: targetScale });
    setFlashNodeId(activeNodeId);
    setTimeout(() => setFlashNodeId(null), 1500);
  }, [activeNodeId, nodePositions]);

  /* Click node on map */
  const handleNodeClick = useCallback((id: string) => {
    setActiveNodeId(id);
    setSidebarOpen(false);
  }, []);

  /* Transform style */
  const transformStyle = useMemo(
    () => ({
      transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
      transformOrigin: "0 0",
      transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [transform, isDragging]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-48px)] w-full overflow-hidden"
      style={{ background: "#05050d" }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Transform wrapper for zoom/pan */}
      <div
        className="absolute inset-0"
        style={transformStyle}
      >
        <StarfieldCanvas width={dims.width} height={dims.height} mouseRef={mouseRef} />
        <ConstellationSVG
          width={dims.width}
          height={dims.height}
          nodePositions={nodePositions}
          activeNodeId={activeNodeId}
          flashNodeId={flashNodeId}
          onNodeClick={handleNodeClick}
        />
      </div>

      <Scanlines />

      {/* Header */}
      <div
        className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-4"
        style={{
          background: "linear-gradient(to bottom, rgba(5,5,13,0.9) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center gap-3" style={{ pointerEvents: "auto" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,168,83,0.4)]">
            <Sparkles className="h-3.5 w-3.5 text-[#d4a853]" />
          </div>
          <div>
            <div className="text-xs tracking-[0.15em] uppercase text-[rgba(255,255,255,0.7)]">
              The Living Codex
            </div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)]">
              Node Constellation Map
            </div>
          </div>
        </div>

        <div className="text-right" style={{ pointerEvents: "auto" }}>
          <h1 className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#d4a853]">
            The Node Constellation
          </h1>
          <p className="mt-0.5 text-[9px] text-[rgba(255,255,255,0.3)]">
            {nodes.filter((n) => n.status === "active").length} active,{" "}
            {nodes.filter((n) => n.status === "future").length} future
          </p>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(true);
        }}
        className="absolute left-4 top-[4.5rem] z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(10,11,15,0.8)] text-[rgba(255,255,255,0.6)] backdrop-blur-sm sm:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Sidebar (desktop always visible) */}
      <div className="hidden h-full pt-20 sm:flex sm:w-64 sm:flex-shrink-0">
        <Sidebar
          nodesList={nodes}
          activeId={activeNodeId}
          onSelect={(id) => {
            setActiveNodeId(id);
            setSidebarOpen(false);
          }}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <Sidebar
              nodesList={nodes}
              activeId={activeNodeId}
              onSelect={(id) => {
                setActiveNodeId(id);
                setSidebarOpen(false);
              }}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Legend */}
      <Legend />

      {/* Zoom controls */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        scale={transform.scale}
      />

      {/* Detail Panel (desktop) */}
      <AnimatePresence>
        {activeNode && (
          <DetailPanel
            key={activeNode.id}
            node={activeNode}
            onClose={() => setActiveNodeId(null)}
            onFocus={handleFocus}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {activeNode && (
          <MobileBottomSheet
            key={activeNode.id + "-mobile"}
            node={activeNode}
            onClose={() => setActiveNodeId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
