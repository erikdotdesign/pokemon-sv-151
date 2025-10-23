import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";
import { shaderMaterial } from "@react-three/drei";

import NOISE_IMAGE from "../images/noise.webp";
import HIGHLIGHT_IMAGE from "../images/highlight.webp";
import GRADIENT_IMAGE from "../images/gradient.png";
import BANDS_IMAGE from "../images/bands.png";

import cardFrontVertex from "../shaders/vertex/cardFront.vert?raw";
import cardFrontFragment from "../shaders/fragment/cardFront.frag?raw";

const localImages = import.meta.glob('../images_webp/**/*.{webp,png}', { eager: true, query: '?url', import: 'default' });

// ----------------------
// Global textures (loaded once)
// ----------------------
const highlightTexture = new THREE.TextureLoader().load(HIGHLIGHT_IMAGE);
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
  HOLO: 1, 
  ETCHED: 2
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
  cursorPos
}: {
  card: any;
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
  cursorPos: {x: number; y: number};
}) => {
  const matRef = useRef<any>(null);

  // ----------------------
  // Load card-specific textures with memoization
  // ----------------------
  const cardTexture = useMemo(() => new THREE.TextureLoader().load(card.images.front), [card.images.front]);

  const foilTexture = useMemo(() => {
    if (!card.images.foil) return;
    const url = localImages[`../images_webp/foil/${card.ext.tcgl.cardID}.webp`];
    return url ? new THREE.TextureLoader().load(url) : null;
  }, [card.ext.tcgl.cardID, card.images.foil]);

  const etchTexture = useMemo(() => {
    if (!card.images.etch) return;
    const url = localImages[`../images_webp/etch/${card.ext.tcgl.cardID}.webp`];
    return url ? new THREE.TextureLoader().load(url) : null;
  }, [card.ext.tcgl.cardID, card.images.etch]);

  // ----------------------
  // Cursor pointer update (avoid recreating vector)
  // ----------------------
  const pointerRef = useRef(cursorPos);
  pointerRef.current = cursorPos;

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uPointer.set(pointerRef.current.x, pointerRef.current.y);
    }
  });

  return (
    <mesh position={[0, 0, depth]}>
      <RoundedPlaneGeometry width={width} height={height} cornerRadius={cornerRadius} />
      <cardFrontMaterial
        ref={matRef}
        uFoilType={card.foil ? CARD_FOIL_MAP[card.foil.type] : 0}
        uMaskType={card.foil ? CARD_MASK_MAP[card.foil.mask] : 0}
        uTextureCard={cardTexture}
        uTextureNoise={noiseTexture}
        uTextureHighlight={highlightTexture}
        uTextureEtch={etchTexture}
        uTextureFoil={foilTexture}
        uTextureGradient={gradientTexture}
        uTextureBands={bandsTexture}
        depthTest={false}
        depthWrite={false}
        transparent={false}
      />
    </mesh>
  );
}

export default CardFront;