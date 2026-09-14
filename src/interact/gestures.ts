import { inertia } from "../engine/tokens";

export type PointerSample = { x: number; y: number; t: number };

export function dragVelocity(prev: PointerSample | null, next: PointerSample) {
  if (!prev) return 0;
  const dt = Math.max(1e-3, next.t - prev.t);
  return ((next.x - prev.x) / dt) * inertia.dragGain;
}

export type Gesture = "pinch" | "swipe" | "tap";
export type GestureMotion = "scale" | "rotate" | "highlight";

export const touchMap: Record<Gesture, GestureMotion> = {
  pinch: "scale",
  swipe: "rotate",
  tap: "highlight",
};

export function isTouchFine() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

export type GestureHandlers = {
  rotate: (dv: number) => void;
  scale: (factor: number) => void;
  highlight: () => void;
};

export function createGestureSession(handlers: GestureHandlers) {
  let prev: PointerSample | null = null;
  let lastPinch = 0;
  return {
    pointerDown(x: number, y: number) {
      prev = { x, y, t: performance.now() / 1000 };
    },
    pointerMove(x: number, y: number) {
      const next = { x, y, t: performance.now() / 1000 };
      const dv = dragVelocity(prev, next);
      if (dv) handlers.rotate(dv);
      prev = next;
    },
    pointerUp() {
      prev = null;
    },
    tap() {
      handlers.highlight();
    },
    pinch(distance: number) {
      if (lastPinch && lastPinch > 0) handlers.scale(distance / lastPinch);
      lastPinch = distance;
    },
    pinchEnd() {
      lastPinch = 0;
    },
    touchMap,
  };
}
