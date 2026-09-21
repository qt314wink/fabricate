import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLampStore } from "./store";
import { lampTable } from "./step";

function kelvinToColor(k: number) {
  const t = (k - 2200) / (5000 - 2200);
  return new THREE.Color().setHSL(0.08 + t * 0.08, 0.55, 0.62);
}

export function LampMesh() {
  const stem = useRef<THREE.Mesh>(null);
  const shade = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const d = lampTable.values() as any;
    const h = d.height / 100;
    const r = d.shadeRadius / 100;
    const bend = (d.neckBend * Math.PI) / 180;
    if (stem.current) {
      stem.current.scale.set(0.18, h, 0.18);
      stem.current.position.y = h / 2;
      stem.current.rotation.z = bend * 0.25;
    }
    if (shade.current) {
      shade.current.position.set(Math.sin(bend) * h * 0.35, h + 0.6, 0);
      shade.current.scale.set(r, r * 0.45, r);
      shade.current.rotation.z = bend;
    }
    if (bulb.current) {
      bulb.current.emissive = kelvinToColor(d.temperature);
      bulb.current.emissiveIntensity = 1.4;
      bulb.current.color = kelvinToColor(d.temperature);
    }
  });

  return (
    <group>
      <mesh ref={stem}>
        <cylinderGeometry args={[1, 1, 1, 24]} />
        <meshStandardMaterial color="#d7d2c8" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh ref={shade}>
        <coneGeometry args={[1, 1, 32, 1, true]} />
        <meshStandardMaterial ref={bulb} color="#f3e6c4" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
