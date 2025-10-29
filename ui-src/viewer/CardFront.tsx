import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";
import { shaderMaterial } from "@react-three/drei";

import useTextureWithFallback from "./useTextureWithFallback";
import cardFrontVertex from "../shaders/vertex/cardFront.vert";
import cardFrontFragment from "../shaders/fragment/cardFront.frag";

import NOISE_IMAGE from "../images_webp/noise.webp";
import GRADIENT_IMAGE from "../images_webp/gradient.webp";
import BANDS_IMAGE from "../images_webp/bands.webp";
import { RotatorHandle } from "./Rotator";
import { usePostProcessing } from "./usePostProcessing";
import { Card, CardFoilMask, CardFoilType } from "../reducer";

const FOIL_IMAGES = import.meta.glob('../images_webp/foil/*.webp', { eager: true, import: 'default' });
const ETCH_IMAGES = import.meta.glob('../images_webp/etch/*.webp', { eager: true, import: 'default' });

// ----------------------
// Global textures (loaded once)
// ----------------------
const noiseTexture = new THREE.TextureLoader().load(NOISE_IMAGE);
const gradientTexture = new THREE.TextureLoader().load(GRADIENT_IMAGE);
gradientTexture.colorSpace = THREE.SRGBColorSpace;
const bandsTexture = new THREE.TextureLoader().load(BANDS_IMAGE);

export const CARD_FOIL_MAP: Record<CardFoilType, number> = { FLAT_SILVER: 1, SV_HOLO: 2, SV_ULTRA: 3, SUN_PILLAR: 4 };
export const CARD_MASK_MAP: Record<CardFoilMask, number> = { REVERSE: 1, HOLO: 2, ETCHED: 3 };

// ----------------------
// Shader material
// ----------------------
export const CardFrontMaterial = shaderMaterial(
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
    uUsePostProcessing: true
  },
  cardFrontVertex,
  cardFrontFragment,
);

extend({ CardFrontMaterial });

// ----------------------
// CardFront component
// ----------------------
const CardFront = ({
  card,
  width,
  height,
  depth,
  cornerRadius,
  rotatorRef
}: {
  card: Card;
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
  rotatorRef: React.RefObject<RotatorHandle | null>;
}) => {
  const postProcessing = usePostProcessing();
  const matRef = useRef<any>(null);

  // ----------------------
  // Textures (all via useTextureWithFallback)
  // ----------------------
  const cardTexture = useTextureWithFallback({
    primaryUrl: card.images.front
  });
  const foilTexture = useTextureWithFallback({
    primaryUrl: card.images.foil,
    fallbackUrl: FOIL_IMAGES[`../images_webp/foil/${card.ext.tcgl.cardID}.webp`] as string,
    colorSpace: THREE.LinearSRGBColorSpace
  });
  const etchTexture = useTextureWithFallback({
    primaryUrl: card.images.etch,
    fallbackUrl: ETCH_IMAGES[`../images_webp/etch/${card.ext.tcgl.cardID}.webp`] as string,
    colorSpace: THREE.LinearSRGBColorSpace
  });

  // ----------------------
  // Update pointer each frame
  // ----------------------
  useFrame(() => {
    if (matRef.current && rotatorRef.current) {
      const { cursorPos } = rotatorRef.current;
      matRef.current.uPointer.set(cursorPos.current.x, cursorPos.current.y);
    }
  });

  // ----------------------
  // Dispose material on unmount
  // ----------------------
  useEffect(() => {
    const mat = matRef.current;
    return () => {
      if (cardTexture) cardTexture.dispose();
      if (foilTexture) foilTexture.dispose();
      if (etchTexture) etchTexture.dispose();
      if (mat) mat.dispose();
    };
  }, []);

  return (
    <mesh position={[0, 0, depth]}>
      <RoundedPlaneGeometry 
        width={width} 
        height={height} 
        cornerRadius={cornerRadius} />
      {/* @ts-ignore */}
      <cardFrontMaterial
        ref={matRef}
        uFoilType={card.foil ? CARD_FOIL_MAP[card.foil.type] : 0}
        uMaskType={card.foil ? CARD_MASK_MAP[card.foil.mask] : 0}
        uTextureCard={cardTexture}
        uTextureNoise={noiseTexture}
        uTextureEtch={etchTexture}
        uTextureFoil={foilTexture}
        uTextureGradient={gradientTexture}
        uTextureBands={bandsTexture}
        uUsePostProcessing={postProcessing} />
    </mesh>
  );
};

export default CardFront;