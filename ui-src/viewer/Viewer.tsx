import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Action, State } from "../reducer";

import PackViewer from "./PackViewer";
import Floor from "./Floor";

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
      <color attach="background" args={['#eee']} />
      <fog attach="fog" args={['#eee', 0, 20]} />
      <ambientLight intensity={2} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      <directionalLight
        position={[-4, 8, 6]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      {
        state.view === "packs"
        ? <PackViewer 
            state={state} 
            dispatch={dispatch} />
        : null
      }
      {/* <ContactShadows
        position={[0, state.packs.current.opened ? -1.75 : -2.25, 0]}
        scale={10}
        blur={1}
        far={10}
        opacity={0.25} /> */}
      <Floor state={state} />
      <OrbitControls />
    </Canvas>
  );
};

export default Viewer;