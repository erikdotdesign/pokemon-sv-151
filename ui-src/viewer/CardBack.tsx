import useTextureWithFallback from "./useTextureWithFallback";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";

import BACK_IMAGE from "../images_webp/back.webp";

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
  const backTexture = useTextureWithFallback(BACK_IMAGE);

  return (
    <mesh
      position={[0, 0, depth]}
      rotation={[0, Math.PI, 0]}>
      <RoundedPlaneGeometry 
        width={width} 
        height={height} 
        cornerRadius={cornerRadius} />
      <meshStandardMaterial
        map={backTexture} />
    </mesh>
  );
}

export default CardBack;