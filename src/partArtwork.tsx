import React from "react";
import { partSize, type End, type Part } from "./model";

const componentImageAsset = (kind: Part["kind"]) => {
  switch (kind) {
    case "arduino":
      return "/components/boards/arduino-uno.png";
    case "breadboard":
      return "/components/breadboards/breadboard.png";
    case "led":
      return "/components/indicators/led.png";
    case "resistor":
      return "/components/passive/resistor.png";
    case "photoresistor":
      return "/components/passive/photoresistor.png";
    case "button":
      return "/components/input/pushbutton.png";
    case "potentiometer":
      return "/components/input/potentiometer.png";
    case "battery":
      return "/components/power/battery-9v.png";
    case "servo":
      return "/components/output/servo-motor.png";
    case "motor":
      return "/components/output/dc-motor.png";
    default:
      return "/components/boards/arduino-uno.png";
  }
};

const componentImageFrame = (kind: Part["kind"]) => {
  switch (kind) {
    case "arduino":
      return { x: 0, y: 0, width: 240, height: 160 };
    case "breadboard":
      return { x: 0, y: 0, width: 300, height: 150 };
    case "led":
      return { x: 0, y: 0, width: 100, height: 180 };
    case "resistor":
      return { x: 0, y: 0, width: 160, height: 70 };
    case "button":
      return { x: 0, y: 0, width: 110, height: 100 };
    case "battery":
      return { x: 0, y: 0, width: 100, height: 150 };
    case "potentiometer":
      return { x: 0, y: 0, width: 110, height: 150 };
    case "servo":
      return { x: 0, y: 0, width: 160, height: 120 };
    case "motor":
      return { x: 0, y: 0, width: 170, height: 112 };
    case "photoresistor":
      return { x: 0, y: 0, width: 90, height: 125 };
    default:
      return { x: 0, y: 0, width: 120, height: 80 };
  }
};

const componentImageAspectRatio = () => "xMidYMid meet";

const BREADBOARD_DEBUG =
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

export function PartView({
  part,
  selected,
  onDown,
  onPin,
}: {
  part: Part;
  selected: boolean;
  onDown: (event: React.PointerEvent<SVGGElement>, p: Part) => void;
  onPin: (e: End) => void;
}) {
  const size = partSize(part.kind);
  const width = size.width;
  const height = size.height;
  const selectionStroke = selected ? "#ef5da8" : "rgba(0,0,0,0)";
  const imageFrame = componentImageFrame(part.kind);
  const imageAsset = componentImageAsset(part.kind);
  const imageAspect = componentImageAspectRatio();

  const labelX =
    part.kind === "motor"
      ? width / 2 + 12
      : part.kind === "arduino"
        ? width / 2 + 8
        : width / 2;
  const labelY = part.kind === "motor" ? -18 : -14;

  const pinMap = part.pins.map((pin) => (
    <g
      key={pin.id}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onPin({ partId: part.id, pinId: pin.id });
      }}
    >
      <circle
        cx={pin.x}
        cy={pin.y}
        r={7}
        fill="#161b2b"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
      />
      <circle cx={pin.x} cy={pin.y} r={3} fill="#ffb3cf" />
      <text
        x={pin.x}
        y={
          part.kind === "arduino"
            ? pin.y < height / 2
              ? pin.y + 16
              : pin.y - 12
            : pin.y + 3
        }
        textAnchor="middle"
        fill="#e5d8ea"
        fontSize={part.kind === "arduino" ? "7" : "9"}
        fontFamily="DM Sans, sans-serif"
      >
        {pin.label}
      </text>
    </g>
  ));

  return (
    <g
      transform={`translate(${part.x} ${part.y}) rotate(${part.rotation} ${width / 2} ${height / 2})`}
      onPointerDown={(event) => onDown(event, part)}
      onClick={(event) => event.stopPropagation()}
      style={{ cursor: "grab" }}
    >
      <rect
        x={-8}
        y={-8}
        width={width + 16}
        height={height + 16}
        rx={12}
        fill="transparent"
        pointerEvents="all"
        stroke={selectionStroke}
        strokeWidth={selected ? 3 : 0}
        strokeDasharray={selected ? "7 5" : undefined}
      />

      <image
        href={imageAsset}
        x={imageFrame.x}
        y={imageFrame.y}
        width={imageFrame.width}
        height={imageFrame.height}
        preserveAspectRatio={imageAspect}
        opacity={0.98}
        style={{ pointerEvents: "all", cursor: "grab" }}
      />

      {part.kind === "breadboard" &&
        (part.holes ?? []).map((hole) => (
          <g key={hole.id}>
            <ellipse
              cx={hole.x}
              cy={hole.y}
              rx={4.2}
              ry={4.6}
              fill={hole.nodeGroup.includes("power") ? "#7d8ca5" : "#607a8f"}
              stroke="rgba(22, 30, 38, 0.75)"
              strokeWidth={0.8}
            />
            <ellipse
              cx={hole.x}
              cy={hole.y}
              rx={2.3}
              ry={2.7}
              fill={hole.side === "power" ? "#b9c9d8" : "#4d6478"}
              opacity={0.75}
            />
          </g>
        ))}

      {BREADBOARD_DEBUG &&
        part.kind === "breadboard" &&
        (part.holes ?? []).map((hole) => (
          <g key={`debug-${hole.id}`} pointerEvents="none">
            <circle
              cx={hole.x}
              cy={hole.y}
              r={5}
              fill="none"
              stroke="#00a8ff"
              strokeWidth={1.2}
            />
            <circle
              cx={hole.x}
              cy={hole.y}
              r={1.8}
              fill="#00ff88"
              stroke="#ffffff"
              strokeWidth={0.4}
            />
            <line
              x1={hole.x - 3}
              y1={hole.y}
              x2={hole.x + 3}
              y2={hole.y}
              stroke="#00a8ff"
              strokeWidth={0.6}
            />
            <line
              x1={hole.x}
              y1={hole.y - 3}
              x2={hole.x}
              y2={hole.y + 3}
              stroke="#00a8ff"
              strokeWidth={0.6}
            />
          </g>
        ))}

      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fill="#f7edf5"
        fontSize="11"
        fontFamily="DM Sans, sans-serif"
      >
        {part.name}
      </text>
      {pinMap}
    </g>
  );
}
