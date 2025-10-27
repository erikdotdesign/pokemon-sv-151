import { Action, State } from "../reducer";

import PackPuller from "./PackPuller";
import Floor from "./Floor";
import { useRef } from "react";
import { AmbientLight, DirectionalLight, Mesh } from "three";

const Packs = ({ 
  state,
  dispatch
}: { 
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const floorRef = useRef<Mesh>(null);
  const packRef = useRef<Mesh>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const dirLightRef1 = useRef<DirectionalLight>(null);
  const dirLightRef2 = useRef<DirectionalLight>(null);

  return (
    <>
      <color attach="background" args={['#EBF3FF']} />
      <fog attach="fog" args={['#EBF3FF', 0, 25]} />
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
      <Floor ref={floorRef} state={state} />
    </>
  );
};

export default Packs;