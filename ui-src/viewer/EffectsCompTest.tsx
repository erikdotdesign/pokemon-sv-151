import { useRef } from "react";
import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { EffectComposer, BrightnessContrast } from "@react-three/postprocessing";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";
import { State } from "../reducer";

const CardFrontMaterial = shaderMaterial(
  { 
    uTextureCard: null,
    uUsePostProcessing: true // flag to detect if postprocessing is active
  },
  // Vertex Shader
  `
  varying vec2 vUv;

  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  uniform sampler2D uTextureCard;
  uniform bool uUsePostProcessing;

  vec3 sRGBToLinear(vec3 c) {
    return pow(c, vec3(2.2));
  }

  vec3 linearTosRGB(vec3 c) {
    return pow(c, vec3(1.0 / 2.2));
  }

  void main() {
    vec3 color = texture2D(uTextureCard, vUv).rgb;

    // If no postprocessing, convert back to sRGB for display
    if (!uUsePostProcessing) {
      color = linearTosRGB(color);
    }

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ CardFrontMaterial });

export const CARD_ASPECT = 733 / 1024;
export const CARD_WIDTH = 2;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
export const CARD_CORNER_RADIUS = 0.15;

const EffectsCompTest = ({ 
  canvasRef,
  state
}: { 
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  state: State;
}) => {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const card = state.cardsById[Object.keys(state.cardsById)[0]];
  const cardTexture = new THREE.TextureLoader().load(card.images.front);
  cardTexture.colorSpace = THREE.SRGBColorSpace;
  const postProcessing = true;
  return (
    <Canvas 
      ref={canvasRef} 
      shadows 
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        // toneMapping: THREE.NoToneMapping
      }}>
      <ambientLight ref={ambientLightRef} intensity={10} />
      <mesh position={[0, 0, 0]}>
        <RoundedPlaneGeometry 
          width={CARD_WIDTH} 
          height={CARD_HEIGHT} 
          cornerRadius={CARD_CORNER_RADIUS} />
        <cardFrontMaterial
          uTextureCard={cardTexture}
          uUsePostProcessing={postProcessing} />
      </mesh>
      <EffectComposer enabled={postProcessing}>
        <BrightnessContrast
          brightness={0} // brightness. min: -1, max: 1
          contrast={0} // contrast: min -1, max: 1
        />
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  );
};

export default EffectsCompTest;