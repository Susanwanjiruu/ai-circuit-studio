# AI Circuit Studio

**Design. Build. Program. Simulate. Understand.**

AI Circuit Studio is an AI-powered electronics design and simulation platform inspired by the circuit-building experience of Tinkercad Circuits.

The goal is to make electronics design and experimentation more accessible by bringing circuit construction, programming, simulation, and AI-assisted engineering into one interactive environment.

Users will be able to build circuits using realistic electronic components, connect them through a virtual workspace, write and test microcontroller code, simulate circuit behaviour, and use AI to understand, troubleshoot, and improve their designs.

The project is actively under development.

## Vision

AI Circuit Studio aims to provide a complete electronics prototyping experience where users can:

- **Design circuits:** Build circuits using a library of electronic components, breadboards, microcontrollers, sensors, and other electronic devices.
- **Connect components:** Create electrical connections through an interactive workspace with realistic breadboard connectivity.
- **Program microcontrollers:** Write, edit, compile, and execute code for supported microcontroller boards.
- **Simulate circuits:** Test circuit behaviour, inspect electrical signals, and observe how components interact without requiring physical hardware.
- **Use virtual instruments:** Work with tools such as multimeters, oscilloscopes, and serial monitors.
- **Learn electronics:** Experiment with circuits, explore component behaviour, and understand electronic concepts through practical projects.
- **Work with AI:** Describe circuit ideas in natural language, generate circuit configurations and code, identify connection errors, interpret simulation results, and receive debugging assistance.

## AI-Powered Capabilities

AI is intended to be part of the engineering workflow rather than a separate chatbot.

The assistant will progressively support:

- Generating circuits from natural-language descriptions.
- Recommending appropriate components.
- Creating and modifying circuit connections.
- Generating microcontroller code.
- Explaining circuit behaviour.
- Identifying wiring and programming errors.
- Analysing simulation results.
- Suggesting and applying validated circuit corrections.

All AI-generated changes should operate through the same underlying circuit model and validation rules as manual editing.

## Current Development Status

AI Circuit Studio is in its early development stage.

The initial foundation includes:

- Interactive circuit workspace.
- Component selection and placement.
- Component movement and rotation.
- Pin-to-pin wire creation and deletion.
- Component inspection and editing.
- Circuit project persistence.
- JSON circuit import and export.
- Initial component artwork and library.

These capabilities form the foundation for the broader platform. Full electrical simulation, firmware execution, and advanced AI-assisted engineering are still part of the development roadmap.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| AI integration | Google Gemini API |
| Electrical simulation (planned) | ngspice |
| Microcontroller compilation (planned) | Arduino CLI |
| AVR firmware emulation (planned) | simavr |

Additional technologies and simulation integrations may be introduced as development progresses.

## Development Roadmap

The project is being developed incrementally, with each stage building on the previous foundation.

- [x] Initial interactive circuit workspace.
- [x] Component placement, movement, and rotation.
- [x] Basic wiring and circuit project management.
- [ ] Accurate breadboard electrical connectivity.
- [ ] Expanded electronic component library.
- [ ] Electrical simulation engine integration.
- [ ] Microcontroller compilation and firmware execution.
- [ ] Integration between firmware execution and electrical simulation.
- [ ] Virtual instruments and debugging tools.
- [ ] Schematic design and additional circuit views.
- [ ] AI-assisted circuit generation and modification.
- [ ] AI-powered debugging and simulation analysis.
- [ ] Learning resources and guided electronics projects.

## Getting Started

### Requirements

- Node.js 20 or later.
- npm.

### Installation

Clone the repository:

```bash
git clone https://github.com/Susanwanjiruu/ai-circuit-studio.git
cd ai-circuit-studio
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Start the development environment:

```bash
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

The optional Gemini integration requires a valid API key configured in the local environment.

## Project Structure

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

## Project Status

AI Circuit Studio is an evolving project. Features described in the vision and roadmap represent intended capabilities, not necessarily functionality available in the current release.

Contributions, feedback, and ideas are welcome as the platform develops.

---

**AI Circuit Studio — Making electronics design more accessible through interactive engineering and artificial intelligence.**