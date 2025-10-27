import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { State } from "../reducer";
import { useEffect, useState } from "react";
import { BlendFunction } from "postprocessing";

const PacksEffects = ({ 
  state,
  floorRef,
  packRef,
  lightRefs
}: { 
  state: State;
  floorRef: React.RefObject<THREE.Mesh | null>;
  packRef: React.RefObject<THREE.Mesh | null>;
  lightRefs: React.RefObject<THREE.Light | null>[];
}) => {
  const { scene } = useThree();

  const [bloomSelection, setBloomSelection] = useState<THREE.Object3D[]>([]);
  const [bloomLights, setBloomLights] = useState<THREE.Light[]>([]);

  // Wait until refs are populated
  useEffect(() => {
    const floor = floorRef.current;
    const pack = packRef.current;
    const lights = lightRefs.map(l => l.current).filter(Boolean) as THREE.Light[];

    if (floor && pack && lights.length) {
      setBloomSelection([floor, pack]);
      setBloomLights(lights);
    }
  }, [floorRef, packRef, lightRefs]);

  if (bloomLights.length === 0 || bloomSelection.length === 0) return null;

  return (
    <EffectComposer enabled={false}>
      <SelectiveBloom
        lights={bloomLights}
        selection={bloomSelection}
        intensity={0} // The bloom intensity.
        luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.05} // smoothness of the luminance threshold. Range is [0, 1]
      />
    </EffectComposer>
  );
};

export default PacksEffects;