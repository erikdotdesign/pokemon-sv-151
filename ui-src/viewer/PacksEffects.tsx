import * as THREE from "three";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { State } from "../reducer";
import { useEffect, useState, useRef } from "react";

import { usePostProcessing } from "./usePostProcessing";

const PacksEffects = ({ 
  state,
  packRef,
  lightRefs
}: { 
  state: State;
  packRef: React.RefObject<THREE.Mesh | null>;
  lightRefs: React.RefObject<THREE.Light | null>[];
}) => {
  const postProcessing = usePostProcessing();

  // Use refs, not state
  const bloomSelection = useRef<THREE.Object3D[]>([]);
  const bloomLights = useRef<THREE.Light[]>([]);

  // Populate refs once
  useEffect(() => {
    const pack = packRef.current;
    const lights = lightRefs.map(l => l.current).filter(Boolean) as THREE.Light[];

    if (pack && lights.length) {
      bloomSelection.current = [pack];
      bloomLights.current = lights;
    }
  }, [packRef, lightRefs]);

  return (
    postProcessing &&
    <EffectComposer>
      <SelectiveBloom
        lights={bloomLights.current}
        selection={bloomSelection.current}
        intensity={1}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025} />
    </EffectComposer>
  );
};

export default PacksEffects;