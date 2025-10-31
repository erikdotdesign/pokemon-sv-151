import * as THREE from "three";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PostProcessingContext } from "./usePostProcessing";
import { Action, State } from "../reducer";

import Effects from "./Effects";
import Enviornment from "./Enviornment";
import Lights, { LightsHandle } from "./Lights";
import Floor from "./Floor";
import ViewerRouter from "./ViewerRouter";

const Viewer = ({ 
  canvasRef,
  state,
  dispatch
}: { 
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const packRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<LightsHandle>(null);

  return (
    <PostProcessingContext.Provider value={true}>
      <Canvas 
        ref={canvasRef} 
        shadows 
        gl={{ outputColorSpace: THREE.SRGBColorSpace }}>
        <Enviornment />
        <Lights ref={lightsRef} />
        <ViewerRouter
          packRef={packRef}
          state={state}
          dispatch={dispatch} />
        <Floor state={state} />
        <Effects 
          lightsRef={lightsRef}
          packRef={packRef}
          state={state} />
        {/* <OrbitControls /> */}
      </Canvas>
    </PostProcessingContext.Provider>
  );
};

export default Viewer;