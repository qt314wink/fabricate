import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ringTable } from "./step";

const COL = new THREE.Color();

export function RingMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const last = useRef({ r: 0, tube: 0 });

  useFrame(() => {
    const d = ringTable.values();
    const bore = d.innerRadius;
    const tube = d.shankThickness;
    const radius = bore + tube;
    if (mesh.current) {
      mesh.current.scale.set(1, Math.max(0.45, d.shankWidth / 4), 1);
      mesh.current.rotation.z = ((d.twist ?? 0) * Math.PI) / 180;
      if (Math.abs(last.current.r - radius) > 0.04 || Math.abs(last.current.tube - tube) > 0.03) {
        mesh.current.geometry.dispose();
        mesh.current.geometry = new THREE.TorusGeometry(radius, tube, 24, 80);
        last.current = { r: radius, tube };
      }
    }
    if (mat.current) {
      COL.setHSL(d.metalHue ?? 0.12, 0.38, 0.58);
      mat.current.color.copy(COL);
      mat.current.metalness = 0.88;
      mat.current.roughness = 1 - (d.polish ?? 0.7);
    }
  });

  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.8, 0]}>
      <torusGeometry args={[9.9, 1.8, 24, 80]} />
      <meshStandardMaterial ref={mat} color="#c4b49a" metalness={0.88} roughness={0.28} />
    </mesh>
  );
}
