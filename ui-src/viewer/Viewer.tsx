import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PostProcessingContext } from "./usePostProcessing";
import { Action, State } from "../reducer";

import PacksViewer from "./PacksViewer";

const Viewer = ({ 
  canvasRef,
  state,
  dispatch
}: { 
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    <PostProcessingContext.Provider value={true}>
      <Canvas 
        ref={canvasRef} 
        shadows 
        gl={{ 
          outputColorSpace: THREE.SRGBColorSpace
        }}>
        {
          state.view === "packs"
          ? <PacksViewer 
              state={state} 
              dispatch={dispatch} />
          : null
        }
        <OrbitControls />
      </Canvas>
    </PostProcessingContext.Provider>
  );
};

export default Viewer;