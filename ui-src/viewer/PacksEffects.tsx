import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { State } from "../reducer";
import { useEffect, useState } from "react";
import { BlendFunction } from "postprocessing";

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

  const [bloomSelection, setBloomSelection] = useState<THREE.Object3D[]>([]);
  const [bloomLights, setBloomLights] = useState<THREE.Light[]>([]);

  // Wait until refs are populated
  useEffect(() => {
    // const floor = floorRef.current;
    const pack = packRef.current;
    const lights = lightRefs.map(l => l.current).filter(Boolean) as THREE.Light[];

    if (pack && lights.length) {
      setBloomSelection([pack]);
      setBloomLights(lights);
    }
  }, [packRef, lightRefs]);

  if (bloomLights.length === 0 || bloomSelection.length === 0) return null;

  return (
    postProcessing &&
    <EffectComposer>
      <SelectiveBloom
        lights={bloomLights}
        selection={bloomSelection}
        intensity={1}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025} />
    </EffectComposer>
  );
};

export default PacksEffects;