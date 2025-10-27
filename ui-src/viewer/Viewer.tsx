import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Action, State } from "../reducer";

import Packs from "./Packs";

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
    <Canvas 
      ref={canvasRef} 
      shadows 
      gl={{ stencil: true }}>
      {
        state.view === "packs"
        ? <Packs 
            state={state} 
            dispatch={dispatch} />
        : null
      }
      <OrbitControls />
    </Canvas>
  );
};

export default Viewer;