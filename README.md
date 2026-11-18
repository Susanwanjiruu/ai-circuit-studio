# AI Circuit Studio

Runnable React + TypeScript + Vite circuit-editor starter with an optional Gemini-backed assistant.

## Run it

Requirements: Node.js 20+ and npm.

```bash
unzip ai-circuit-studio.zip
cd ai-circuit-studio
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. It runs without an API key. To enable Gemini, add your key to `.env` as `GEMINI_API_KEY=...`, then restart the dev command. The key stays on the local Express server.

## Included

- Categorized component library and search.
- SVG workspace with draggable components, selection and rotation.
- Pin-to-pin wiring with invalid and duplicate connection checks.
- Delete components and their connected wires.
- Component inspector and basic design warnings.
- Rule-based simulation preview.
- Arduino-style sketch editor.
- Circuit JSON import/export.
- Optional Gemini assistant endpoint.

## Important limitations

This is a runnable foundation, **not yet full Tinkercad Circuits parity**. The simulation is a rule-based visual preview, not SPICE or a physical/electrical solver. Arduino code is editable but not compiled or executed. Breadboard holes are currently visual and are not modeled as electrical nodes. The component library is a starter set.

For a full product, the next substantial engineering work is: breadboard/netlist topology, electrical solver and component models, MCU firmware compilation/emulation, schematic view, virtual instruments, serial monitor/debugging, expanded parts, Codeblocks, lessons, and validated AI operations for wiring/code/simulation/debugging.

## Structure

- `src/model.ts`: circuit types and core operations
- `src/App.tsx`: editor interface and interactions
- `src/style.css`: application styling
- `server/index.ts`: optional Gemini API proxy
