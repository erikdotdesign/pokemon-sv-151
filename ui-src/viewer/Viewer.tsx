import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import Card from "./Card";
import Pack from "./Pack";
import CardStack from "./CardStack";

import cardData from "../data/cards_merged.json";

const getRandomCards = (count = 10) => {
  const shuffled = [...cardData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const Viewer = ({ 
  card,
  canvasRef
}: {
  card: any | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => {
  const [view, setView] = useState("pack");

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
        {
          view === "pack"
          ? <Pack onClick={(e) => setView("stack")} />
          : <CardStack cards={getRandomCards()} setView={setView} />
        }
      </Stage>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default Viewer;