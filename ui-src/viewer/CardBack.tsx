import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";

import BACK_IMAGE from "../images_webp/back.webp";
import { useEffect } from "react";

const CardBack = ({
  width,
  height,
  depth,
  cornerRadius
}: {
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
}) => {
  const backTexture = useLoader(THREE.TextureLoader, BACK_IMAGE);

  useEffect(() => {
    if (backTexture) backTexture.dispose();
  }, []);

  return (
    <mesh
      position={[0, 0, depth]}
      rotation={[0, Math.PI, 0]}>
      <RoundedPlaneGeometry 
        width={width} 
        height={height} 
        cornerRadius={cornerRadius} />
      <meshStandardMaterial
        map={backTexture}
        fog={false} />
    </mesh>
  );
}

export default CardBack;