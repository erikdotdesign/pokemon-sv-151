import * as THREE from "three";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { State } from "../reducer";
import { useEffect, useState } from "react";

import { usePostProcessing } from "./usePostProcessing";
import { LightsHandle } from "./Lights";

const Effects = ({ 
  state,
  packRef,
  lightsRef
}: { 
  state: State;
  packRef: React.RefObject<THREE.Mesh | null>;
  lightsRef: React.RefObject<LightsHandle | null>;
}) => {
  const postProcessing = usePostProcessing();

  const [bloomSelection, setBloomSelection] = useState<THREE.Object3D[]>([]);
  const [bloomLights, setBloomLights] = useState<THREE.Light[]>([]);

  useEffect(() => {
    const pack = packRef.current;
    const ambientLight = lightsRef.current?.ambient.current;
    const dirLight1 = lightsRef.current?.dir1.current;
    const dirLight2 = lightsRef.current?.dir2.current;

    if (ambientLight && dirLight1 && dirLight2) {
      setBloomSelection(pack ? [pack] : []);
      setBloomLights([ambientLight, dirLight1, dirLight2]);
    }
  }, [packRef, lightsRef, state.overlay.collectionVisible]);

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

export default Effects;