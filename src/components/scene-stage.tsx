import { MotionCanvas, type StageCamera } from "@/components/motion-canvas";
import { BracketMesh } from "@/apps/bracket/BracketMesh";
import { stepBracket } from "@/apps/bracket/step";
import { LampMesh } from "@/apps/lamp/LampMesh";
import { stepLamp } from "@/apps/lamp/step";
import { RingMesh } from "@/apps/ring/RingMesh";
import { stepRing } from "@/apps/ring/step";

const CAMERAS: Record<"bracket" | "lamp" | "ring", StageCamera> = {
  bracket: { position: [72, 52, 108], target: [0, 3, 0], fov: 32 },
  lamp: { position: [34, 18, 64], target: [0, 13, 0], fov: 34 },
  ring: { position: [12, 9, 22], target: [0, 0, 0], fov: 30 },
};

const SHADOWS = { bracket: 200, lamp: 70, ring: 36 } as const;
const GRIDS = { bracket: 220, lamp: 80, ring: 40 } as const;

export function SceneStage({
  cell,
  orbitEnabled = true,
}: {
  cell: "bracket" | "lamp" | "ring";
  orbitEnabled?: boolean;
}) {
  const step = cell === "bracket" ? stepBracket : cell === "lamp" ? stepLamp : stepRing;
  return (
    <div className="relative h-[min(58dvh,36rem)] w-full overflow-hidden border-b border-border bg-surface touch-none">
      <MotionCanvas
        step={step}
        orbitEnabled={orbitEnabled}
        camera={CAMERAS[cell]}
        shadowScale={SHADOWS[cell]}
        className="absolute inset-0 h-full w-full"
      >
        {cell === "bracket" && <gridHelper args={[GRIDS[cell], 22, "#24303a", "#151a20"]} />}
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[GRIDS[cell] * 1.6, GRIDS[cell] * 1.6]} />
          <meshStandardMaterial color="#101318" roughness={1} metalness={0} />
        </mesh>
        {cell === "bracket" && <BracketMesh />}
        {cell === "lamp" && <LampMesh />}
        {cell === "ring" && <RingMesh />}
      </MotionCanvas>
    </div>
  );
}

