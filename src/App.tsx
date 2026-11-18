import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  add,
  blank,
  catalog,
  checks,
  move,
  partSize,
  pos,
  remove,
  removeWire,
  wire,
  isValidCircuit,
} from "./model";
import type { Circuit, End, Kind, Part } from "./model";
import { PartView } from "./partArtwork";

const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 680;

const CIRCUIT_STORAGE_KEY = "ai-circuit-studio:circuit:v1";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const findOpenPosition = (parts: Part[], kind: Kind) => {
  const size = partSize(kind);
  const candidates = [
    { x: 210, y: 180 },
    { x: 430, y: 180 },
    { x: 650, y: 180 },
    { x: 260, y: 350 },
    { x: 490, y: 350 },
    { x: 720, y: 350 },
    { x: 330, y: 520 },
  ];

  for (const candidate of candidates) {
    const candidateBounds = {
      x: candidate.x,
      y: candidate.y,
      width: size.width,
      height: size.height,
    };

    const overlaps = parts.some((part) => {
      const partSizeValue = partSize(part.kind);
      const partBounds = {
        x: part.x,
        y: part.y,
        width: partSizeValue.width,
        height: partSizeValue.height,
      };

      return !(
        candidateBounds.x + candidateBounds.width + 24 < partBounds.x ||
        candidateBounds.x > partBounds.x + partBounds.width + 24 ||
        candidateBounds.y + candidateBounds.height + 24 < partBounds.y ||
        candidateBounds.y > partBounds.y + partBounds.height + 24
      );
    });

    if (!overlaps) {
      return candidate;
    }
  }

  return { x: 220, y: 200 };
};

export default function App() {
  const [c, setC] = useState<Circuit>(() => restoreSavedCircuit());
  const [sel, S] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [mode, M] = useState<"select" | "wire">("select");
  const [start, T] = useState<End | null>(null);
  const [filter, F] = useState("");
  const [group, G] = useState("All");
  const [tab, B] = useState("AI assistant");
  const [chat, H] = useState(
    "Welcome! Describe a circuit you want to build, or use the component library.",
  );
  const [prompt, P] = useState("");
  const [busy, Q] = useState(false);
  const [code, CODE] = useState(
    "void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}",
  );
  const [sim, SIM] = useState(false);
  const [status, ST] = useState("Ready");
  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
  });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<
    | { kind: "move"; id: string; offsetX: number; offsetY: number }
    | {
        kind: "pan";
        startX: number;
        startY: number;
        startViewport: { x: number; y: number; width: number; height: number };
      }
    | null
  >(null);

  const selected = useMemo(
    () => c.parts.find((part) => part.id === sel) ?? null,
    [c, sel],
  );
  const warnings = useMemo(() => checks(c), [c]);
  const groups = ["All", ...new Set(catalog.map((item) => item.group))];
  const items = catalog.filter(
    (item) =>
      (group === "All" || item.group === group) &&
      item.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const screenToWorld = (event: Pick<PointerEvent, "clientX" | "clientY">) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const fitToScreen = () => {
    setViewport({ x: 0, y: 0, width: WORLD_WIDTH, height: WORLD_HEIGHT });
    ST("Workspace centered.");
  };

  const adjustZoom = (factor: number, anchor?: { x: number; y: number }) => {
    setViewport((current) => {
      const nextWidth = clamp(current.width * factor, 420, 1800);
      const nextHeight = clamp(current.height * factor, 280, 1260);
      const pointer = anchor ?? {
        x: current.x + current.width / 2,
        y: current.y + current.height / 2,
      };
      const ratioX = (pointer.x - current.x) / current.width;
      const ratioY = (pointer.y - current.y) / current.height;

      return {
        x: pointer.x - nextWidth * ratioX,
        y: pointer.y - nextHeight * ratioY,
        width: nextWidth,
        height: nextHeight,
      };
    });
  };

  const addPart = (kind: Kind) => {
    setC((v) => {
      const placement = findOpenPosition(v.parts, kind);
      return add(v, kind, placement.x, placement.y);
    });
    ST(`${catalog.find((item) => item.kind === kind)?.name ?? kind} added.`);
  };

  const pin = (next: End) => {
    if (mode !== "wire") {
      S(next.partId);
      return;
    }

    if (!start) {
      T(next);
      ST("Choose a second pin to complete the connection.");
      return;
    }

    try {
      setC((v) => wire(v, start, next));
      ST("Pins connected.");
    } catch (err) {
      ST(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      T(null);
    }
  };

  const down = (event: React.PointerEvent<SVGGElement>, part: Part) => {
    event.stopPropagation();

    if (mode !== "select") return;

    S(part.id);
    setSelectedWireId(null);

    const world = screenToWorld(event);
    drag.current = {
      kind: "move",
      id: part.id,
      offsetX: world.x - part.x,
      offsetY: world.y - part.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const svgPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const state = drag.current;
    if (!state) return;
    const world = screenToWorld(event);

    if (state.kind === "move") {
      setC((v) =>
        move(v, state.id, world.x - state.offsetX, world.y - state.offsetY),
      );
      return;
    }

    const deltaX = world.x - state.startX;
    const deltaY = world.y - state.startY;
    setViewport({
      ...state.startViewport,
      x: state.startViewport.x - deltaX,
      y: state.startViewport.y - deltaY,
    });
  };

  const svgPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (
      event.target !== event.currentTarget &&
      !(event.target as SVGElement).classList.contains("workspace-surface")
    ) {
      return;
    }

    const world = screenToWorld(event);
    drag.current = {
      kind: "pan",
      startX: world.x,
      startY: world.y,
      startViewport: viewport,
    };
  };

  const svgWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const anchor = screenToWorld(event);
    adjustZoom(event.deltaY < 0 ? 1.12 : 0.88, anchor);
  };

  const save = () => {
    const a = document.createElement("a");
    const u = URL.createObjectURL(
      new Blob([JSON.stringify(c, null, 2)], { type: "application/json" }),
    );
    a.href = u;
    a.download = "circuit-project.json";
    a.click();
    URL.revokeObjectURL(u);
  };

  const load = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data: unknown = JSON.parse(String(reader.result));
        if (!isValidCircuit(data)) throw new Error("Invalid project");
        setC(data);
        ST("Project imported.");
      } catch {
        ST("Invalid project file.");
      }
    };
    reader.readAsText(file);
  };

  async function ask() {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    P("");
    H((x) => `${x}\n\nYou: ${q}`);
    Q(true);

    try {
      const response = await fetch("/api/ai/circuit-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, circuit: c }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed");

      if (Array.isArray(data.actions)) {
        setC((old) =>
          data.actions.reduce(
            (
              v: Circuit,
              action: { type: string; kind: Kind; x?: number; y?: number },
            ) => {
              if (action.type === "add_component")
                return add(v, action.kind, action.x, action.y);
              return v;
            },
            old,
          ),
        );
      }

      H(
        (x) =>
          `${x}\n\nAI: ${data.message || "I added the suggested component."}`,
      );
    } catch (err) {
      const text = /led|blink/i.test(q);
      if (text) {
        setC((v) => add(add(v, "resistor", 420, 240), "led", 600, 240));
        H(
          (x) =>
            `${x}\n\nAI: I added a resistor and LED. Connect the resistor to a board output and then route the LED cathode to ground. Add a GEMINI_API_KEY to .env for complete AI planning.`,
        );
      } else {
        H(
          (x) =>
            `${x}\n\nAI: ${(err instanceof Error ? err.message : "AI service unavailable.") + " Add GEMINI_API_KEY to .env to enable Gemini."}`,
        );
      }
    } finally {
      Q(false);
    }
  }

  const deleteSelection = () => {
    if (selected) {
      setC((v) => remove(v, selected.id));
      S(null);
      setSelectedWireId(null);
      ST("Component deleted.");
      return;
    }

    if (selectedWireId) {
      setC((v) => removeWire(v, selectedWireId));
      setSelectedWireId(null);
      ST("Wire deleted.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      event.preventDefault();
      deleteSelection();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, selectedWireId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CIRCUIT_STORAGE_KEY, JSON.stringify(c));
    } catch {
      // Storage can be unavailable or full; the in-memory editor remains usable.
    }
  }, [c]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div>
            <strong>AI Circuit Studio</strong>
            <small>DESIGN · BUILD · SIMULATE</small>
          </div>
        </div>
        <div className="project-tag">● Untitled circuit</div>
        <div className="toolbar-actions">
          <button
            onClick={() => {
              S(null);
              setSelectedWireId(null);
              M("select");
              T(null);
              setC(blank());
              ST("Fresh workspace ready.");
            }}
          >
            New
          </button>
          <button onClick={save}>Export</button>
          <label className="button-like">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={(e) => load(e.target.files?.[0])}
            />
          </label>
          <button
            className="primary"
            onClick={() => {
              SIM(!sim);
              ST(!sim ? "Simulation preview running." : "Simulation stopped.");
            }}
          >
            {sim ? "■ Stop" : "▶ Simulate"}
          </button>
        </div>
      </header>

      <nav className="modebar">
        <button
          className={mode === "select" ? "chosen" : ""}
          onClick={() => {
            M("select");
            setSelectedWireId(null);
            T(null);
          }}
        >
          Select
        </button>
        <button
          className={mode === "wire" ? "chosen" : ""}
          onClick={() => {
            M("wire");
            S(null);
            setSelectedWireId(null);
            T(null);
          }}
        >
          Wire
        </button>
        <button
          disabled={!selected}
          onClick={() => {
            if (selected) {
              setC((v) => ({
                ...v,
                parts: v.parts.map((p) =>
                  p.id === selected.id
                    ? { ...p, rotation: (p.rotation + 90) % 360 }
                    : p,
                ),
              }));
            }
          }}
        >
          Rotate
        </button>
        <button
          disabled={!selected && !selectedWireId}
          onClick={deleteSelection}
        >
          Delete
        </button>
        <span>
          {mode === "wire"
            ? "Choose two component pins to connect."
            : "Drag parts to move them."}
        </span>
        <button
          className="clear"
          onClick={() => {
            setC(blank());
            S(null);
            setSelectedWireId(null);
            T(null);
            ST("Workspace cleared.");
          }}
        >
          Clear workspace
        </button>
      </nav>

      <main className="main-layout">
        <aside className="library-panel">
          <div className="panel-header">
            <h3>Components</h3>
            <span>{items.length}</span>
          </div>
          <input
            value={filter}
            onChange={(e) => F(e.target.value)}
            placeholder="Search components…"
          />
          <div className="group-tabs">
            {groups.map((itemGroup) => (
              <button
                key={itemGroup}
                className={group === itemGroup ? "chosen" : ""}
                onClick={() => G(itemGroup)}
              >
                {itemGroup}
              </button>
            ))}
          </div>
          <div className="catalog-items">
            {items.map((item) => (
              <button
                key={item.kind}
                className="part-card"
                onClick={() => addPart(item.kind)}
              >
                <span className={`library-icon ${item.kind}`}>
                  {partGlyph(item.kind)}
                </span>
                <span className="part-copy">
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </span>
                <b>+</b>
              </button>
            ))}
          </div>
          <footer>Click a component to add it to the circuit.</footer>
        </aside>

        <section className="workspace-panel">
          <div className="workspace-header">
            <div>
              <small>PROJECT WORKSPACE</small>
              <strong>Circuit design</strong>
            </div>
            <div className="workspace-metrics">
              <span>{c.parts.length} parts</span>
              <span>{c.wires.length} wires</span>
            </div>
          </div>

          <div className="viewport-toolbar">
            <span>Zoom</span>
            <div className="zoom-tools">
              <button onClick={() => adjustZoom(0.88)}>−</button>
              <button onClick={() => adjustZoom(1.12)}>+</button>
              <button onClick={fitToScreen}>Fit</button>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
            onPointerMove={svgPointerMove}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onPointerLeave={() => {
              if (drag.current?.kind === "pan") drag.current = null;
            }}
            onPointerDown={svgPointerDown}
            onClick={(event) => {
              if (
                event.target === event.currentTarget ||
                (event.target as SVGElement).classList?.contains(
                  "workspace-surface",
                )
              ) {
                S(null);
                setSelectedWireId(null);
              }
            }}
            onWheel={svgWheel}
            className="workspace-canvas"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(120, 132, 156, 0.22)"
                  strokeWidth="0.7"
                />
              </pattern>
            </defs>
            <rect
              className="workspace-surface"
              x={viewport.x}
              y={viewport.y}
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              fill="url(#grid)"
            />
            {c.wires.map((wire) => {
              const a = c.parts.find((part) => part.id === wire.from.partId);
              const b = c.parts.find((part) => part.id === wire.to.partId);
              if (!a || !b) return null;

              const p = pos(a, wire.from.pinId);
              const q = pos(b, wire.to.pinId);
              const midX = (p.x + q.x) / 2;
              const d = `M ${p.x} ${p.y} L ${midX} ${p.y} L ${midX} ${q.y} L ${q.x} ${q.y}`;

              return (
                <g key={wire.id}>
                  {selectedWireId === wire.id && (
                    <path
                      d={d}
                      fill="none"
                      stroke="#fff3fb"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pointerEvents="none"
                    />
                  )}
                  <path
                    d={d}
                    fill="none"
                    stroke={selectedWireId === wire.id ? "#ff4fa3" : wire.color}
                    strokeWidth={selectedWireId === wire.id ? "7" : "4"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      if (mode !== "select") return;
                      S(null);
                      setSelectedWireId(wire.id);
                    }}
                    style={{
                      cursor: mode === "select" ? "pointer" : "crosshair",
                    }}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="stroke"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      if (mode !== "select") return;
                      S(null);
                      setSelectedWireId(wire.id);
                    }}
                  />
                </g>
              );
            })}
            {c.parts.map((part) => (
              <PartView
                key={part.id}
                part={part}
                selected={sel === part.id}
                onDown={down}
                onPin={pin}
              />
            ))}
          </svg>

          <div className="workspace-status">
            <span>{status}</span>
            <span>
              {warnings.length
                ? `${warnings.length} design warnings`
                : "No basic warnings"}
            </span>
          </div>
          <div className="sim-status">
            <strong>
              {sim ? "● Simulation preview" : "○ Simulation stopped"}
            </strong>
            <span>Rule-based preview only — not a circuit solver.</span>
          </div>
        </section>

        <aside className="inspector-panel">
          <div className="tabs">
            {["AI assistant", "Code", "Inspect"].map((item) => (
              <button
                key={item}
                className={tab === item ? "chosen" : ""}
                onClick={() => B(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "AI assistant" ? (
            <div className="panel-body copilot-panel">
              <h3>Circuit copilot</h3>
              <small>
                Ask for help designing and understanding the circuit.
              </small>
              <div className="chat-window">
                {chat
                  .split("\n\n")
                  .slice(-5)
                  .map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
              </div>
              <div className="prompt-list">
                {[
                  "Help me build a blinking LED",
                  "Explain why LEDs need resistors",
                  "Review my circuit",
                ].map((item) => (
                  <button key={item} onClick={() => P(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => P(e.target.value)}
                placeholder="Describe your circuit…"
              />
              <button
                className="primary send-button"
                disabled={busy || !prompt.trim()}
                onClick={() => void ask()}
              >
                {busy ? "Thinking…" : "Send ↑"}
              </button>
              <small className="panel-note">
                Verify AI suggestions before connecting real hardware.
              </small>
            </div>
          ) : tab === "Code" ? (
            <div className="panel-body code-panel">
              <h3>Arduino sketch · C++</h3>
              <textarea value={code} onChange={(e) => CODE(e.target.value)} />
              <small>
                Editor only: compiling and firmware execution are not included
                in Phase 1.
              </small>
            </div>
          ) : (
            <div className="panel-body inspect-panel">
              <h3>Component inspector</h3>
              {selected ? (
                <>
                  <div className="selected-label">{selected.name}</div>
                  <label>Value / label</label>
                  <input
                    value={selected.value}
                    onChange={(e) =>
                      setC((v) => ({
                        ...v,
                        parts: v.parts.map((part) =>
                          part.id === selected.id
                            ? { ...part, value: e.target.value }
                            : part,
                        ),
                      }))
                    }
                  />
                  <h4>Pins</h4>
                  {selected.pins.map((pin) => (
                    <div className="pin-row" key={pin.id}>
                      <span>{pin.label}</span>
                      <small>
                        {
                          c.wires.filter(
                            (wire) =>
                              (wire.from.partId === selected.id &&
                                wire.from.pinId === pin.id) ||
                              (wire.to.partId === selected.id &&
                                wire.to.pinId === pin.id),
                          ).length
                        }{" "}
                        connections
                      </small>
                    </div>
                  ))}
                </>
              ) : (
                <p>Select a component to inspect it.</p>
              )}

              <h4>Design checks</h4>
              {warnings.length ? (
                warnings.map((warning) => (
                  <p key={warning} className="warning">
                    ⚠ {warning}
                  </p>
                ))
              ) : (
                <p className="clear-warning">No warnings.</p>
              )}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function partGlyph(kind: Kind) {
  switch (kind) {
    case "arduino":
      return "A";
    case "breadboard":
      return "B";
    case "led":
      return "◉";
    case "resistor":
      return "≈";
    case "button":
      return "▢";
    case "battery":
      return "◫";
    case "potentiometer":
      return "◌";
    case "servo":
      return "S";
    case "motor":
      return "M";
    case "photoresistor":
      return "◎";
    default:
      return "◈";
  }
}

const restoreSavedCircuit = (): Circuit => {
  try {
    const saved = window.localStorage.getItem(CIRCUIT_STORAGE_KEY);
    if (!saved) return blank();
    const parsed: unknown = JSON.parse(saved);
    return isValidCircuit(parsed) ? parsed : blank();
  } catch {
    return blank();
  }
};
