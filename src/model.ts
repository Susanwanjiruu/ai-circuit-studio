export type Kind =
  | "arduino"
  | "breadboard"
  | "led"
  | "resistor"
  | "button"
  | "battery"
  | "potentiometer"
  | "servo"
  | "motor"
  | "photoresistor";

export type Pin = { id: string; label: string; x: number; y: number };
export type BreadboardHole = {
  id: string;
  x: number;
  y: number;
  nodeGroup: string;
  side: "left" | "right" | "power";
};
export type Part = {
  id: string;
  kind: Kind;
  name: string;
  x: number;
  y: number;
  rotation: number;
  value: string;
  pins: Pin[];
  holes?: BreadboardHole[];
};
export type End = { partId: string; pinId: string };
export type Wire = { id: string; from: End; to: End; color: string };
export type Circuit = { parts: Part[]; wires: Wire[] };

export type CatalogEntry = {
  kind: Kind;
  name: string;
  group: string;
  description: string;
};

export const catalog: CatalogEntry[] = [
  {
    kind: "arduino",
    name: "Arduino Uno",
    group: "Boards",
    description: "Microcontroller board with digital and analog headers.",
  },
  {
    kind: "breadboard",
    name: "Breadboard",
    group: "Prototyping",
    description:
      "Solderless prototype platform with power rails and terminal strips.",
  },
  {
    kind: "led",
    name: "LED",
    group: "Output",
    description:
      "Standard indicator lamp with polarity and current-limiting requirements.",
  },
  {
    kind: "resistor",
    name: "Resistor",
    group: "Basic",
    description:
      "Fixed resistor with configurable resistance value and band markings.",
  },
  {
    kind: "button",
    name: "Pushbutton",
    group: "Input",
    description: "Momentary input switch with two terminals.",
  },
  {
    kind: "battery",
    name: "9V Battery",
    group: "Power",
    description: "Portable DC source for prototyping and testing.",
  },
  {
    kind: "potentiometer",
    name: "Potentiometer",
    group: "Input",
    description: "Adjustable analog control with three terminals.",
  },
  {
    kind: "servo",
    name: "Servo Motor",
    group: "Output",
    description: "Positioning actuator with signal, power and ground pins.",
  },
  {
    kind: "motor",
    name: "DC Motor",
    group: "Output",
    description: "Rotating actuator with positive and negative leads.",
  },
  {
    kind: "photoresistor",
    name: "Photoresistor",
    group: "Input",
    description: "Light-dependent resistor with wide analog behaviour.",
  },
];

export const partSize = (kind: Kind) => {
  switch (kind) {
    case "arduino":
      return { width: 240, height: 160 };
    case "breadboard":
      return { width: 300, height: 150 };
    case "led":
      return { width: 100, height: 180 };
    case "resistor":
      return { width: 160, height: 70 };
    case "button":
      return { width: 110, height: 100 };
    case "battery":
      return { width: 100, height: 150 };
    case "potentiometer":
      return { width: 110, height: 150 };
    case "servo":
      return { width: 160, height: 120 };
    case "motor":
      return { width: 170, height: 112 };
    case "photoresistor":
      return { width: 90, height: 125 };
    default:
      return { width: 120, height: 80 };
  }
};

const pinSets: Record<Kind, Pin[]> = {
  arduino: [
    { id: "AREF", label: "AREF", x: 102, y: 28 },
    { id: "GND", label: "GND", x: 132, y: 132 },
    { id: "D13", label: "D13", x: 112, y: 28 },
    { id: "D12", label: "D12", x: 122, y: 28 },
    { id: "D11", label: "D11", x: 132, y: 28 },
    { id: "D10", label: "D10", x: 142, y: 28 },
    { id: "D9", label: "D9", x: 152, y: 28 },
    { id: "D8", label: "D8", x: 162, y: 28 },
    { id: "D7", label: "D7", x: 172, y: 28 },
    { id: "D6", label: "D6", x: 182, y: 28 },
    { id: "D5", label: "D5", x: 192, y: 28 },
    { id: "D4", label: "D4", x: 202, y: 28 },
    { id: "D3", label: "D3", x: 212, y: 28 },
    { id: "D2", label: "D2", x: 222, y: 28 },
    { id: "D1", label: "D1", x: 232, y: 28 },
    { id: "D0", label: "D0", x: 238, y: 28 },
    { id: "IOREF", label: "IOREF", x: 92, y: 132 },
    { id: "RESET", label: "RESET", x: 102, y: 132 },
    { id: "3.3V", label: "3.3V", x: 112, y: 132 },
    { id: "5V", label: "5V", x: 122, y: 132 },
    { id: "VIN", label: "VIN", x: 142, y: 132 },
    { id: "A0", label: "A0", x: 152, y: 132 },
    { id: "A1", label: "A1", x: 162, y: 132 },
    { id: "A2", label: "A2", x: 172, y: 132 },
    { id: "A3", label: "A3", x: 182, y: 132 },
    { id: "A4", label: "A4", x: 192, y: 132 },
    { id: "A5", label: "A5", x: 202, y: 132 },
    { id: "SDA", label: "SDA", x: 212, y: 132 },
    { id: "SCL", label: "SCL", x: 222, y: 132 },
  ],
  breadboard: [
    { id: "power-positive", label: "+", x: 22, y: 18 },
    { id: "power-negative", label: "-", x: 22, y: 132 },
    { id: "terminal-left", label: "L", x: 150, y: 18 },
    { id: "terminal-right", label: "R", x: 270, y: 18 },
  ],
  led: [
    { id: "anode", label: "+", x: 50, y: 18 },
    { id: "cathode", label: "−", x: 50, y: 162 },
  ],
  resistor: [
    { id: "p1", label: "1", x: 18, y: 35 },
    { id: "p2", label: "2", x: 142, y: 35 },
  ],
  button: [
    { id: "p1", label: "1", x: 18, y: 26 },
    { id: "p2", label: "2", x: 92, y: 26 },
  ],
  battery: [
    { id: "pos", label: "+", x: 18, y: 34 },
    { id: "neg", label: "−", x: 82, y: 34 },
  ],
  potentiometer: [
    { id: "wiper", label: "W", x: 55, y: 100 },
    { id: "end1", label: "1", x: 20, y: 26 },
    { id: "end2", label: "2", x: 90, y: 26 },
  ],
  servo: [
    { id: "sig", label: "SIG", x: 18, y: 22 },
    { id: "vcc", label: "VCC", x: 18, y: 42 },
    { id: "gnd", label: "GND", x: 18, y: 62 },
  ],
  motor: [
    { id: "pos", label: "+", x: 18, y: 42 },
    { id: "neg", label: "−", x: 152, y: 42 },
  ],
  photoresistor: [
    { id: "p1", label: "1", x: 18, y: 38 },
    { id: "p2", label: "2", x: 72, y: 38 },
  ],
};

const defaultValue = (kind: Kind) => {
  switch (kind) {
    case "resistor":
      return "220 Ω";
    case "led":
      return "Red";
    case "battery":
      return "9V";
    case "potentiometer":
      return "10kΩ";
    case "servo":
      return "90°";
    case "motor":
      return "12V";
    case "photoresistor":
      return "10kΩ";
    default:
      return "";
  }
};

export const createBreadboardHoleLayout = (): BreadboardHole[] => {
  const holes: BreadboardHole[] = [];

  const pngWidth = 664;
  const pngHeight = 373;
  const frameWidth = 300;
  const frameHeight = 150;
  const scale = Math.min(frameWidth / pngWidth, frameHeight / pngHeight);
  const offsetX = (frameWidth - pngWidth * scale) / 2;
  const mapX = (pngX: number) => offsetX + pngX * scale;
  const mapY = (pngY: number) => pngY * scale;

  // 30 terminal columns: 15 per side, 5 holes per row band.
  const terminalStartX = 104;
  const terminalStepX = 17;
  const terminalStartY = 92;
  const terminalStepY = 24;

  for (let sideColumn = 0; sideColumn < 15; sideColumn += 1) {
    for (let row = 0; row < 5; row += 1) {
      holes.push({
        id: `breadboard-left-${sideColumn}-${row}`,
        x: mapX(terminalStartX + sideColumn * terminalStepX),
        y: mapY(terminalStartY + row * terminalStepY),
        nodeGroup: `left-strip-${sideColumn}`,
        side: "left",
      });

      holes.push({
        id: `breadboard-right-${sideColumn}-${row}`,
        x: mapX(
          terminalStartX + 15 * terminalStepX + sideColumn * terminalStepX,
        ),
        y: mapY(terminalStartY + row * terminalStepY),
        nodeGroup: `right-strip-${sideColumn}`,
        side: "right",
      });

      // Lower terminal bands form the second five-hole side of the rail-divider layout.
      holes.push({
        id: `breadboard-left-${sideColumn}-${row + 5}`,
        x: mapX(terminalStartX + sideColumn * terminalStepX),
        y: mapY(terminalStartY + (row + 5) * terminalStepY),
        nodeGroup: `left-strip-${sideColumn}-lower`,
        side: "left",
      });

      holes.push({
        id: `breadboard-right-${sideColumn}-${row + 5}`,
        x: mapX(
          terminalStartX + 15 * terminalStepX + sideColumn * terminalStepX,
        ),
        y: mapY(terminalStartY + (row + 5) * terminalStepY),
        nodeGroup: `right-strip-${sideColumn}-lower`,
        side: "right",
      });
    }
  }

  // Four power-lane rows, 30 columns each.
  const powerRailStartX = 104;
  const powerRailStepX = 17;
  const positiveRailYs = [42, 56];
  const negativeRailYs = [318, 332];

  for (let column = 0; column < 30; column += 1) {
    for (const pngY of positiveRailYs) {
      holes.push({
        id: `breadboard-power-positive-${column}-${pngY}`,
        x: mapX(powerRailStartX + column * powerRailStepX),
        y: mapY(pngY),
        nodeGroup: "power-positive",
        side: "power",
      });
    }

    for (const pngY of negativeRailYs) {
      holes.push({
        id: `breadboard-power-negative-${column}-${pngY}`,
        x: mapX(powerRailStartX + column * powerRailStepX),
        y: mapY(pngY),
        nodeGroup: "power-negative",
        side: "power",
      });
    }
  }

  return holes;
};

export function createPart(kind: Kind, x = 300, y = 200): Part {
  return {
    id: crypto.randomUUID(),
    kind,
    name: catalog.find((c) => c.kind === kind)?.name ?? kind,
    x,
    y,
    rotation: 0,
    value: defaultValue(kind),
    pins: pinSets[kind].map((pin) => ({ ...pin })),
    holes: kind === "breadboard" ? createBreadboardHoleLayout() : undefined,
  };
}

export const blank = (): Circuit => ({ parts: [], wires: [] });

export function createInitialCircuit(): Circuit {
  return blank();
}

export function add(c: Circuit, k: Kind, x?: number, y?: number): Circuit {
  return { ...c, parts: [...c.parts, createPart(k, x, y)] };
}

export function remove(c: Circuit, id: string): Circuit {
  return {
    parts: c.parts.filter((p) => p.id !== id),
    wires: c.wires.filter((w) => w.from.partId !== id && w.to.partId !== id),
  };
}

export function move(c: Circuit, id: string, x: number, y: number): Circuit {
  return {
    ...c,
    parts: c.parts.map((p) => (p.id === id ? { ...p, x, y } : p)),
  };
}

export function wire(c: Circuit, a: End, b: End): Circuit {
  const pa = c.parts.find((p) => p.id === a.partId);
  const pb = c.parts.find((p) => p.id === b.partId);

  if (
    !pa?.pins.some((p) => p.id === a.pinId) ||
    !pb?.pins.some((p) => p.id === b.pinId)
  ) {
    throw new Error("Invalid pin.");
  }

  if (a.partId === b.partId && a.pinId === b.pinId) {
    throw new Error("A pin cannot connect to itself.");
  }

  const isDuplicate = c.wires.some(
    (w) =>
      (w.from.partId === a.partId &&
        w.from.pinId === a.pinId &&
        w.to.partId === b.partId &&
        w.to.pinId === b.pinId) ||
      (w.from.partId === b.partId &&
        w.from.pinId === b.pinId &&
        w.to.partId === a.partId &&
        w.to.pinId === a.pinId),
  );

  if (isDuplicate) {
    throw new Error("Those pins are already connected.");
  }

  return {
    ...c,
    wires: [
      ...c.wires,
      { id: crypto.randomUUID(), from: a, to: b, color: "#f9a8d4" },
    ],
  };
}

export function pos(part: Part, pinId: string) {
  const pin = part.pins.find((x) => x.id === pinId);
  if (!pin) return { x: part.x, y: part.y };

  const { width, height } = partSize(part.kind);
  const cx = part.x + width / 2;
  const cy = part.y + height / 2;
  const dx = pin.x + part.x - cx;
  const dy = pin.y + part.y - cy;
  const radians = (part.rotation * Math.PI) / 180;

  return {
    x: cx + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: cy + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}

export function checks(c: Circuit) {
  const out: string[] = [];
  if (!c.parts.length) out.push("Add components to begin.");

  for (const p of c.parts) {
    if (
      p.pins.length &&
      !c.wires.some((w) => w.from.partId === p.id || w.to.partId === p.id)
    ) {
      out.push(`${p.name} has no connections.`);
    }
  }

  for (const p of c.parts.filter((x) => x.kind === "led")) {
    const isProtected = c.wires.some(
      (w) =>
        (w.from.partId === p.id &&
          c.parts.find((x) => x.id === w.to.partId)?.kind === "resistor") ||
        (w.to.partId === p.id &&
          c.parts.find((x) => x.id === w.from.partId)?.kind === "resistor"),
    );

    if (!isProtected) {
      out.push("An LED should normally have a current-limiting resistor.");
    }
  }

  return [...new Set(out)];
}

export function removeWire(c: Circuit, wireId: string): Circuit {
  return {
    ...c,
    wires: c.wires.filter((w) => w.id !== wireId),
  };
}

export function isValidCircuit(value: unknown): value is Circuit {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Circuit>;
  if (!Array.isArray(candidate.parts) || !Array.isArray(candidate.wires))
    return false;

  const kinds = new Set(catalog.map((item) => item.kind));
  for (const part of candidate.parts) {
    if (
      !part ||
      typeof part !== "object" ||
      typeof part.id !== "string" ||
      typeof part.name !== "string" ||
      typeof part.value !== "string" ||
      typeof part.kind !== "string" ||
      !kinds.has(part.kind as Kind) ||
      typeof part.x !== "number" ||
      typeof part.y !== "number" ||
      typeof part.rotation !== "number" ||
      !Array.isArray(part.pins) ||
      !part.pins.every(
        (pin) =>
          pin &&
          typeof pin.id === "string" &&
          typeof pin.label === "string" &&
          typeof pin.x === "number" &&
          typeof pin.y === "number",
      )
    ) {
      return false;
    }
  }

  const partMap = new Map(candidate.parts.map((part) => [part.id, part]));
  for (const wire of candidate.wires) {
    if (
      !wire ||
      typeof wire !== "object" ||
      typeof wire.id !== "string" ||
      typeof wire.color !== "string" ||
      !wire.from ||
      typeof wire.from.partId !== "string" ||
      typeof wire.from.pinId !== "string" ||
      !wire.to ||
      typeof wire.to.partId !== "string" ||
      typeof wire.to.pinId !== "string"
    ) {
      return false;
    }

    const fromPart = partMap.get(wire.from.partId);
    const toPart = partMap.get(wire.to.partId);
    if (
      !fromPart?.pins.some((pin) => pin.id === wire.from.pinId) ||
      !toPart?.pins.some((pin) => pin.id === wire.to.pinId)
    ) {
      return false;
    }
  }

  return true;
}
