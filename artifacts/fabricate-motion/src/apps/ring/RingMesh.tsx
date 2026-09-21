import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRingStore } from "./store";
import { ringTable } from "./step";

const color = new THREE.Color();

export function RingMesh() {
  const group = useRef<THREE.Group>(null);
  const torus = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    const d = ringTable.values() as any;
    if (group.current) group.current.rotation.y += dt * 0.25;
    if (torus.current) {
      const R = d.innerRadius + d.shankThickness / 2;
      torus.current.scale.set(1, 1, d.shankWidth / 3.2);
      torus.current.rotation.x = Math.PI / 2;
      torus.current.rotation.z = (d.twist * Math.PI) / 180;
      // torusGeometry args baked at unit; scale major/minor via mesh scale
      torus.current.scale.set(R / 9, R / 9, d.shankWidth / 3.2);
    }
    if (mat.current) {
      color.setHSL(d.metalHue, 0.45, 0.62);
      mat.current.color.copy(color);
      mat.current.metalness = 0.85;
      mat.current.roughness = 1 - d.polish;
    }
  });

  return (
    <group ref={group} position={[0, 8, 0]}>
      <mesh ref={torus}>
        <torusGeometry args={[9, 1.6, 24, 64]} />
        <meshStandardMaterial ref={mat} />
      </mesh>
    </group>
  );
}
