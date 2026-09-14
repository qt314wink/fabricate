import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lampTable } from "./step";

const COL = new THREE.Color();
const SCALE = 0.075;

function kelvinToColor(k: number, out: THREE.Color) {
  const t = (k - 2200) / (5000 - 2200);
  return out.setHSL(0.09 + t * 0.07, 0.42, 0.62);
}

export function LampMesh() {
  const stem = useRef<THREE.Mesh>(null);
  const shade = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.Mesh>(null);
  const bulbMat = useRef<THREE.MeshStandardMaterial>(null);
  const head = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const d = lampTable.values();
    const h = d.height * SCALE;
    const r = d.shadeRadius * SCALE;
    const bend = ((d.neckBend ?? 0) * Math.PI) / 180;
    if (stem.current) {
      stem.current.scale.set(1, h, 1);
      stem.current.position.y = 1.1 + h / 2;
    }
    if (head.current) {
      head.current.position.y = 1.1 + h;
      head.current.rotation.z = bend;
    }
    if (shade.current) {
      shade.current.scale.set(r, r * 0.55, r);
      shade.current.position.set(0, r * 0.12, 0);
    }
    if (bulb.current) {
      bulb.current.position.set(0, -r * 0.08, 0);
      bulb.current.scale.setScalar(Math.max(1.2, r * 0.16));
    }
    if (light.current) {
      light.current.position.set(0, -r * 0.15, 0);
      light.current.intensity = 4.5;
    }
    if (bulbMat.current) {
      kelvinToColor(d.temperature ?? 2700, COL);
      bulbMat.current.emissive.copy(COL);
      bulbMat.current.color.copy(COL);
      bulbMat.current.emissiveIntensity = 1.15;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[4.4, 4.8, 1.1, 32]} />
        <meshStandardMaterial color="#8e949c" metalness={0.62} roughness={0.32} />
      </mesh>
      <mesh ref={stem} position={[0, 8, 0]}>
        <cylinderGeometry args={[0.72, 0.88, 1, 20]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.58} roughness={0.34} />
      </mesh>
      <group ref={head}>
        <mesh>
          <sphereGeometry args={[1.05, 16, 16]} />
          <meshStandardMaterial color="#8e949c" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh ref={shade} rotation={[0, 0, 0]}>
          <coneGeometry args={[1, 1, 32, 1, true]} />
          <meshStandardMaterial color="#d6d2c8" side={THREE.DoubleSide} roughness={0.82} metalness={0.08} />
        </mesh>
        <mesh ref={bulb}>
          <sphereGeometry args={[1.15, 16, 16]} />
          <meshStandardMaterial ref={bulbMat} color="#f2e6c9" />
        </mesh>
        <pointLight ref={light} color="#f2e0b8" distance={48} decay={2} />
      </group>
    </group>
  );
}
