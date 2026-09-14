import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createClock, prefersReducedMotion } from "@/engine/clock";
import type { FrameClock } from "@/engine/clock";
import { hasWebGL } from "@/engine/webgl";

export type SimStep = (clock: FrameClock) => void;

export type StageCamera = {
  position: [number, number, number];
  target?: [number, number, number];
  fov?: number;
};

export function MotionCanvas({
  children,
  step,
  className,
  orbitEnabled = true,
  camera = { position: [72, 52, 108], target: [0, 3, 0], fov: 32 },
  shadowScale = 160,
}: {
  children: ReactNode;
  step: SimStep;
  className?: string;
  orbitEnabled?: boolean;
  camera?: StageCamera;
  shadowScale?: number;
}) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    setOk(hasWebGL());
  }, []);
  if (!ok) {
    return (
      <div
        className="flex h-full min-h-64 items-center justify-center bg-surface px-6 text-center text-sm text-muted"
        role="img"
        aria-label="3D preview unavailable"
      >
        WebGL is not available. Sliders still write targets; the object is not gone.
      </div>
    );
  }
  const target = camera.target ?? ([0, 0, 0] as [number, number, number]);
  return (
    <div className={className ?? "h-full w-full"}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false, preserveDrawingBuffer: true }}
        camera={{ position: camera.position, fov: camera.fov ?? 32, near: 0.1, far: 2000 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ camera: cam }) => {
          cam.lookAt(target[0], target[1], target[2]);
        }}
      >
        <color attach="background" args={["#0a0b0d"]} />
        <hemisphereLight args={["#e4e8ee", "#1a1e24", 0.85]} />
        <directionalLight position={[40, 80, 50]} intensity={1.35} />
        <directionalLight position={[-50, 20, -30]} intensity={0.4} />
        <CameraRig position={camera.position} target={target} />
        <ClockBridge step={step} />
        {children}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.38}
          scale={shadowScale}
          blur={2.4}
          far={50}
          color="#000000"
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enabled={orbitEnabled}
          target={target}
          makeDefault
        />
      </Canvas>
    </div>
  );
}

function CameraRig({
  position,
  target,
}: {
  position: [number, number, number];
  target: [number, number, number];
}) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);
  return null;
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
