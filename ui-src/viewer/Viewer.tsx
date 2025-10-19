import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import Card from "./Card";

const Viewer = ({ 
  card,
  canvasRef
}: {
  card: any | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => {
  return (
    <Canvas
      ref={canvasRef}
      shadows
      gl={{ stencil: true }}>
      <color attach="background" args={['#f2f2f2']} />
      <Stage 
        intensity={7}
        shadows="contact"
        environment={null}>
        <Card />
      </Stage>
      <OrbitControls />
    </Canvas>
  );
};

export default Viewer;