# AI Circuit Studio

**Design. Build. Program. Simulate. Understand.**

AI Circuit Studio is an AI-assisted electronics design environment inspired by tools such as Tinkercad Circuits. It aims to bring circuit construction, microcontroller programming, simulation, and engineering assistance into one interactive workspace.

The project is under active development. This README distinguishes functionality in the current foundation from capabilities planned for later stages.

## Project goals

The platform is being developed to help users:

- Build circuits with electronic components, breadboards, sensors, and microcontrollers.
- Connect components and inspect their pins and properties.
- Write and test microcontroller firmware.
- Simulate circuit behaviour without always requiring physical hardware.
- Use virtual instruments to inspect circuit behaviour.
- Get AI-assisted explanations, design suggestions, and debugging support.

## Current implementation

The initial workspace foundation includes:

- An interactive circuit workspace.
- Component selection, placement, movement, and rotation.
- Pin-to-pin wire creation and deletion.
- Component inspection and editing.
- Circuit project persistence.
- JSON circuit import and export.
- Initial component artwork and library.

These features form the foundation of the product. Full electrical simulation, firmware execution, and advanced AI-assisted engineering are not yet represented as completed capabilities.

## Technology

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| AI integration | Google Gemini API |
| Electrical simulation | ngspice (planned) |
| Firmware compilation | Arduino CLI (planned) |
| AVR emulation | simavr (planned) |

## Architecture direction

The application is being built around a shared circuit model. The workspace, validation logic, simulation integrations, and AI-assisted operations are intended to work against this model so that generated changes follow the same rules as manual edits.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone https://github.com/Susanwanjiruu/ai-circuit-studio.git
cd ai-circuit-studio
npm install
```

Create the local environment file if the project includes the example:

```bash
cp .env.example .env
```

Add the required configuration for optional Gemini functionality. Keep API keys private and never commit your local `.env` file.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Project structure

```text
ai-circuit-studio/
├── public/
│   └── components/
├── server/
│   └── index.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── model.ts
│   ├── partArtwork.tsx
│   └── style.css
├── .env.example
├── package.json
└── README.md
```

## Roadmap

- [x] Initial interactive circuit workspace
- [x] Component placement, movement, and rotation
- [x] Basic wiring and circuit project management
- [ ] Accurate breadboard electrical connectivity
- [ ] Expanded component library
- [ ] Electrical simulation engine integration
- [ ] Microcontroller compilation and firmware execution
- [ ] Integration between firmware execution and electrical simulation
- [ ] Virtual instruments and debugging tools
- [ ] Schematic design and additional circuit views
- [ ] AI-assisted circuit generation and modification
- [ ] AI-powered debugging and simulation analysis
- [ ] Guided electronics projects and learning resources

## Project status

AI Circuit Studio is an evolving engineering project. Items in the goals and roadmap describe intended direction; they should not be interpreted as features already available in the current implementation.

Feedback and contributions are welcome as the project develops.
