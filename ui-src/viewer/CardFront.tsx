import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";

import FRONT_IMAGE from "../images/charizard.png";

const CardFront = ({
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
  const frontTexture = useLoader(THREE.TextureLoader, FRONT_IMAGE);

  return (
    <mesh 
      position={[0, 0, depth]}>
      <RoundedPlaneGeometry 
        width={width} 
        height={height} 
        cornerRadius={cornerRadius} />
      <meshStandardMaterial
        map={frontTexture} />
    </mesh>
  );
}

export default CardFront;