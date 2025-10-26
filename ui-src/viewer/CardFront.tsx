import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";
import { shaderMaterial } from "@react-three/drei";

import useTextureWithFallback from "./useTextureWithFallback";

import cardFrontVertex from "../shaders/vertex/cardFront.vert?raw";
import cardFrontFragment from "../shaders/fragment/cardFront.frag?raw";

import NOISE_IMAGE from "../images_webp/noise.webp";
import GRADIENT_IMAGE from "../images_webp/gradient.webp";
import BANDS_IMAGE from "../images_webp/bands.webp";
import { RotatorHandle } from "./Rotator";

const FOIL_IMAGES = import.meta.glob('../images_webp/foil/*.webp', { eager: true, import: 'default' });
const ETCH_IMAGES = import.meta.glob('../images_webp/etch/*.webp', { eager: true, import: 'default' });

// ----------------------
// Global textures (loaded once)
// ----------------------
const noiseTexture = new THREE.TextureLoader().load(NOISE_IMAGE);
const gradientTexture = new THREE.TextureLoader().load(GRADIENT_IMAGE);
const bandsTexture = new THREE.TextureLoader().load(BANDS_IMAGE);

export const CARD_FOIL_MAP = { 
  NONE: 0, 
  FLAT_SILVER: 1, 
  SV_HOLO: 2,
  SV_ULTRA: 3,
  SUN_PILLAR: 4
};

export const CARD_MASK_MAP = { 
  NONE: 0, 
  REVERSE: 1,
  HOLO: 2, 
  ETCHED: 3
};

const CardFrontMaterial = shaderMaterial(
  {
    uFoilType: 0,
    uMaskType: 0,
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
  card,
  width,
  height,
  depth,
  cornerRadius,
  rotatorRef
}: {
  card: any;
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
  rotatorRef: React.RefObject<RotatorHandle | null>;
}) => {
  const matRef = useRef<any>(null);

  // ----------------------
  // Load card-specific textures with memoization
  // ----------------------
  const cardTexture = useMemo(() => new THREE.TextureLoader().load(card.images.front), [card.images.front]);
  const foilTexture = useTextureWithFallback(card.images.foil, FOIL_IMAGES[`../images_webp/foil/${card.ext.tcgl.cardID}.webp`]);
  const etchTexture = useTextureWithFallback(card.images.etch, ETCH_IMAGES[`../images_webp/etch/${card.ext.tcgl.cardID}.webp`]);

  // ----------------------
  // Cursor pointer update (avoid recreating vector)
  // ----------------------
  // const pointerRef = useRef(cursorPos);
  // pointerRef.current = cursorPos;

  useFrame(() => {
    if (matRef.current && rotatorRef.current) {
      const { cursorPos } = rotatorRef.current;
      matRef.current.uPointer.set(cursorPos.current.x, cursorPos.current.y);
    }
  });

  return (
    <mesh position={[0, 0, depth]}>
      <RoundedPlaneGeometry 
        width={width} 
        height={height} 
        cornerRadius={cornerRadius} />
      <cardFrontMaterial
        ref={matRef}
        uFoilType={card.foil ? CARD_FOIL_MAP[card.foil.type] : 0}
        uMaskType={card.foil ? CARD_MASK_MAP[card.foil.mask] : 0}
        uTextureCard={cardTexture}
        uTextureNoise={noiseTexture}
        uTextureEtch={etchTexture}
        uTextureFoil={foilTexture}
        uTextureGradient={gradientTexture}
        uTextureBands={bandsTexture} />
    </mesh>
  );
}

export default CardFront;