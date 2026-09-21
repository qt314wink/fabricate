import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createClock, prefersReducedMotion } from "../engine/clock";
import type { FrameClock } from "../engine/clock";
import { hasWebGL } from "../engine/webgl";

export type SimStep = (clock: FrameClock) => void;

export function MotionCanvas({
  children,
  step,
  className,
  orbitEnabled = true,
}: {
  children: ReactNode;
  step: SimStep;
  className?: string;
  orbitEnabled?: boolean;
}) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    setOk(hasWebGL());
  }, []);
  if (!ok) {
    return (
      <div className="fm-poster" role="img" aria-label="3D preview unavailable">
        WebGL is not available on this device. The parametric object is still
        editable with the sliders; the canvas stays a poster so we never ship
        a white hole.
      </div>
    );
  }
  return (
    <Canvas className={className} dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 40, 140], fov: 35 }}>
      <color attach="background" args={["#0e1116"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[40, 80, 40]} intensity={1.1} />
      <ClockBridge step={step} />
      {children}
      <OrbitControls enableDamping dampingFactor={0.08} enabled={orbitEnabled} />
    </Canvas>
  );
}

function ClockBridge({ step }: { step: SimStep }) {
  const clock = useRef(createClock());
  useEffect(() => {
    const onVis = () => clock.current.pause(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  useFrame(() => {
    const frame = clock.current.tick(performance.now());
    if (prefersReducedMotion()) {
      step({ ...frame, dt: Math.min(frame.dt, 1 / 30) });
      return;
    }
    step(frame);
  });
  return null;
}
