import * as THREE from "three";
import { useRef } from "react";
import { useLoader, useFrame, extend } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";
import { shaderMaterial } from "@react-three/drei";

import CARD_IMAGE from "../images/fronts/charizard.png";
import ETCH_IMAGE from "../images/etchings/charizard.png";
import FOIL_IMAGE from "../images/foils/charizard.png";
import NOISE_IMAGE from "../images/noise.webp";
import HIGHLIGHT_IMAGE from "../images/highlight.webp";
import GRADIENT_IMAGE from "../images/gradient.png";
import BANDS_IMAGE from "../images/bands.png";

import cardFrontVertex from "../shaders/vertex/cardFront.vert?raw";
import cardFrontFragment from "../shaders/fragment/cardFront.frag?raw";

const CardFrontMaterial = shaderMaterial(
  {
    uRarity: null,
    uTextureCard: null,
    uTextureNoise: null,
    uTextureHighlight: null,
    uTextureFoil: null,
    uTextureEtch: null,
    uTextureGradient: null,
    uTextureBands: null,
    uPointer: new THREE.Vector2(0.5, 0.5),
  },
  cardFrontVertex,
  cardFrontFragment
);

extend({ CardFrontMaterial });

const CardFront = ({
  width,
  height,
  depth,
  cornerRadius,
  cursorPos
}: {
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
  cursorPos: {x: number; y: number};
}) => {
  const matRef = useRef<any>(null);
  const cardTexture = useLoader(THREE.TextureLoader, CARD_IMAGE);
  const foilTexture = useLoader(THREE.TextureLoader, FOIL_IMAGE);
  const etchTexture = useLoader(THREE.TextureLoader, ETCH_IMAGE);
  const highlightTexture = useLoader(THREE.TextureLoader, HIGHLIGHT_IMAGE);
  const noiseTexture = useLoader(THREE.TextureLoader, NOISE_IMAGE);
  const gradientTexture = useLoader(THREE.TextureLoader, GRADIENT_IMAGE);
  const bandsTexture = useLoader(THREE.TextureLoader, BANDS_IMAGE);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uPointer.set(cursorPos.x / 2, cursorPos.y / 2);
  });

  return (
    <group>
      <mesh 
        position={[0, 0, depth]}>
        <RoundedPlaneGeometry 
          width={width} 
          height={height} 
          cornerRadius={cornerRadius} />
        <meshStandardMaterial
          map={cardTexture} />
      </mesh>

      <mesh 
        position={[0, 0, depth + 0.01]}>
        <RoundedPlaneGeometry 
          width={width} 
          height={height} 
          cornerRadius={cornerRadius} />
        <cardFrontMaterial 
          ref={matRef} 
          uRarity={1}
          uTextureCard={cardTexture}
          uTextureNoise={noiseTexture}
          uTextureHighlight={highlightTexture}
          uTextureEtch={etchTexture}
          uTextureFoil={foilTexture}
          uTextureGradient={gradientTexture}
          uTextureBands={bandsTexture}
          transparent />
      </mesh>
    </group>
  );
}

export default CardFront;