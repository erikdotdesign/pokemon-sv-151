import * as THREE from "three";
import { useLoader, extend } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { geometry } from 'maath';

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });

import FRONT_IMAGE from "../images/charizard.png";
import BACK_IMAGE from "../images/back.png";

const CardGeometry = () => {
  const frontTexture = useLoader(THREE.TextureLoader, FRONT_IMAGE);
  const backTexture = useLoader(THREE.TextureLoader, BACK_IMAGE);

  // Card dimensions (in world units)
  const aspect = 733 / 1024;
  const width = 2.5;
  const height = width / aspect;
  const depth = 0.35;

  const cornerRadius = 0.15;

  return (
    <group>
      {/* Rounded card body */}
      <RoundedBox
        args={[width, height, depth]}
        radius={cornerRadius}
        steps={1}
        smoothness={4}
        bevelSegments={0}>
        <meshStandardMaterial color="white" />
      </RoundedBox>

      {/* Front face */}
      <mesh 
        position={[0, 0, depth / 2 - 0.145]}>
        <roundedPlaneGeometry args={[width, height, cornerRadius]} />
        <meshStandardMaterial
          map={frontTexture} />
      </mesh>

      {/* Back face */}
      <mesh
        position={[0, 0, -depth / 2 + 0.145]}
        rotation={[0, Math.PI, 0]}>
        <roundedPlaneGeometry args={[width, height, cornerRadius]} />
        <meshStandardMaterial
          map={backTexture} />
      </mesh>
    </group>
  );
}

export default CardGeometry;