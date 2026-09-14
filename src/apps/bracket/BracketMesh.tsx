import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { holeCenters, holeRadiusAt, MAX_HOLES, type BracketParams } from "@/geometry/bracket";
import { visibleCount } from "@/geometry/toolpath";
import { gcodeToolpath } from "@/geometry/gcode";
import { createGestureSession, isTouchFine } from "@/interact/gestures";
import { tessellatePlate, type PlateSpec } from "@/geometry/tessellate";
import { useBracketStore } from "./store";
import { bracketTable } from "./step";
import { follow, reducedMotion } from "@/engine/tokens";
import { follow1 } from "@/engine/solver";
import { prefersReducedMotion } from "@/engine/clock";

const EMISSIVE = new THREE.Color("#7a9b8a");
const HOVER_LIFT = 2.4;

function holesFrom(d: { width: number; height: number; holeCount: number; holeRadius: number }) {
  return Array.from({ length: MAX_HOLES }, (_, i) => {
    const [x, y] = holeCenters(d as BracketParams)[i];
    return { x, y, r: holeRadiusAt(d as BracketParams, i) };
  });
}

function applyMesh(geom: THREE.BufferGeometry, spec: PlateSpec) {
  const tri = tessellatePlate(spec);
  geom.setAttribute("position", new THREE.BufferAttribute(tri.positions, 3));
  geom.setIndex(new THREE.BufferAttribute(tri.indices, 1));
  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  geom.computeBoundingBox();
}

export function BracketMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const geom = useMemo(() => {
    const d = useBracketStore.getState().display;
    const g = new THREE.BufferGeometry();
    applyMesh(g, {
      width: d.width,
      height: d.height,
      thickness: d.thickness,
      fillet: d.fillet,
      holes: holesFrom(d),
      pitch: 2.6,
    });
    return g;
  }, []);
  const pathGeom = useMemo(() => new THREE.BufferGeometry(), []);
  const lastKey = useRef("");
  const pathPts = useRef<{ x: number; y: number; z: number }[]>([]);
  const hoverT = useRef(0);
  const hoverV = useRef(0);
  const gest = useRef(
    createGestureSession({
      rotate: (dv) =>
        useBracketStore.setState((s) => ({
          targets: { ...s.targets, orbitImpulse: (s.targets.orbitImpulse ?? 0) + dv },
        })),
      scale: (f) => {
        const w = useBracketStore.getState().targets.width;
        useBracketStore.getState().setParam("width", w * f);
      },
      highlight: () =>
        useBracketStore.setState((s) => ({ targets: { ...s.targets, emissive: 1 } })),
    }),
  );

  useFrame((_, dt) => {
    const d = bracketTable.values();
    hoverV.current = follow1(hoverV.current, hoverT.current, dt, follow.hoverTau);
    const liftOff = prefersReducedMotion() || reducedMotion.disableHoverLift || !isTouchFine();
    if (mesh.current) {
      mesh.current.rotation.y = d.orbit ?? 0;
      mesh.current.position.y = liftOff ? 0 : hoverV.current * HOVER_LIFT;
    }
    if (mat.current) {
      mat.current.emissive.copy(EMISSIVE);
      mat.current.emissiveIntensity = d.emissive ?? 0;
    }
    const key = `${d.width}|${d.height}|${d.thickness}|${d.fillet}|${d.holeCount}|${d.holeRadius}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      pathPts.current = gcodeToolpath(d as never);
      applyMesh(geom, {
        width: d.width,
        height: d.height,
        thickness: d.thickness,
        fillet: d.fillet ?? 0,
        holes: holesFrom({
          width: d.width,
          height: d.height,
          holeCount: d.holeCount,
          holeRadius: d.holeRadius,
        }),
        pitch: 2.6,
      });
    }
    if ((d.pathProgress ?? 0) > 0.002) {
      const pts = pathPts.current;
      const n = visibleCount(pts, d.pathProgress ?? 0);
      const lift = (d.thickness ?? 6) + 0.45;
      const arr = new Float32Array(Math.max(n, 1) * 3);
      for (let i = 0; i < n; i++) {
        arr[i * 3] = pts[i].x;
        arr[i * 3 + 1] = pts[i].z + lift;
        arr[i * 3 + 2] = pts[i].y;
      }
      pathGeom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      pathGeom.setDrawRange(0, n);
      pathGeom.computeBoundingSphere();
    } else {
      pathGeom.setDrawRange(0, 0);
    }
  });

  return (
    <group>
      <mesh
        ref={mesh}
        geometry={geom}
        onPointerDown={(e) => {
          e.stopPropagation();
          useBracketStore.getState().dispatch({ type: "POINTER_DOWN_MESH" });
          gest.current.pointerDown(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons) gest.current.pointerMove(e.clientX, e.clientY);
          else hoverT.current = 1;
        }}
        onPointerOut={() => {
          hoverT.current = 0;
        }}
        onPointerUp={() => {
          useBracketStore.getState().dispatch({ type: "POINTER_UP" });
          gest.current.pointerUp();
        }}
        onClick={() => gest.current.tap()}
      >
        <meshStandardMaterial
          ref={mat}
          color="#8a9098"
          metalness={0.38}
          roughness={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>
      <line>
        <primitive object={pathGeom} attach="geometry" />
        <lineBasicMaterial color="#7a9b8a" />
      </line>
    </group>
  );
}
