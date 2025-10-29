import { useRef } from "react";
import { AmbientLight, DirectionalLight, Mesh } from "three";
import { Action, State } from "../reducer";
import { usePostProcessing } from "./usePostProcessing";

import PackPuller from "./PackPuller";
import Floor from "./Floor";
import PacksEffects from "./PacksEffects";

const PacksViewer = ({ 
  state,
  dispatch
}: { 
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const postProcessing = usePostProcessing();
  const packRef = useRef<Mesh>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const dirLightRef1 = useRef<DirectionalLight>(null);
  const dirLightRef2 = useRef<DirectionalLight>(null);

  return (
    <>
      <color attach="background" args={[postProcessing ? "#E1E5EF" : '#E2E6F0']} />
      <fog attach="fog" args={[postProcessing ? "#E1E5EF" : '#E2E6F0', 0, 25]} />
      <ambientLight ref={ambientLightRef} intensity={2} />
      <directionalLight
        ref={dirLightRef1}
        position={[8, 12, 8]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      <directionalLight
        ref={dirLightRef2}
        position={[-8, 12, 8]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      <PackPuller 
        packRef={packRef}
        state={state} 
        dispatch={dispatch} />
      <Floor state={state} />
      <PacksEffects 
        lightRefs={[ambientLightRef, dirLightRef1, dirLightRef2]}
        packRef={packRef}
        state={state} />
    </>
  );
};

export default PacksViewer;