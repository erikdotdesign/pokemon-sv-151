import { useRef } from "react";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { a, useSpring, to } from "@react-spring/three";
import { Action, State } from "../reducer";
import { getPackCards, getGodPack } from "../selectors";

import Pack from "./Pack";
import CardStack from "./CardStack";
import { useState } from "react";

const springConfig = { mass: 1, tension: 170, friction: 26 };

const useCombinedPosition = (y: any, z: any) => to([y, z], (yy, zz) => [0, yy, zz]);

const PackPuller = ({ 
  state, 
  dispatch,
  packRef
}: { 
  state: State; 
  dispatch: (action: Action) => void;
  packRef: React.RefObject<THREE.Mesh | null>;
}) => {
  const { opened } = state.packs.current;
  const [packRecycle, setPackRecycle] = useState(false);
  const [stackInPlace, setStackInPlace] = useState(false);
  const [stackViewed, setStackViewed] = useState(false);
  const hoverRef = useRef<THREE.Group>(null!);

  // Pack rotation & scale spring
  const packRotationSpring = useSpring({
    from: { positionY: 10 },
    rotation: opened ? (packRecycle ? [0,0,0] : [-Math.PI/2,0,0]) : [0,0,0],
    positionY: opened ? (packRecycle ? 10 : -1.25) : 0,
    scale: opened ? (packRecycle ? [1,1,1] : [0.5,0.5,0.5]) : [1,1,1],
    config: springConfig,
    immediate: packRecycle
  });

  // Pack slide Z spring
  const packSlideSpring = useSpring({
    positionZ: opened ? (packRecycle ? 1.5 : 10) : 1.5,
    delay: opened ? 200 : 0,
    config: springConfig,
    immediate: packRecycle,
    onRest: () => { if (opened) setPackRecycle(true); }
  });

  const combinedPackPosition = useCombinedPosition(
    packRotationSpring.positionY, packSlideSpring.positionZ
  );

  // Cards rotation & scale spring
  const cardsRotationSpring = useSpring({
    rotation: opened ? (stackViewed ? [-Math.PI/2,0,0] : [0,0,0]) : [-Math.PI/2,0,0],
    scale: opened ? (stackViewed ? [0.5,0.5,0.5] : [1,1,1]) : [0.5,0.5,0.5],
    positionY: opened ? (stackViewed ? -1 : 0) : -1,
    config: springConfig,
    delay: !opened ? 0 : 450,
    immediate: stackViewed,
    onRest: () => {
      if (stackViewed) {
        dispatch({ type: "SET_NEW_CURRENT_PACK", cards: getPackCards(state) });
        setStackViewed(false);
        setPackRecycle(false);
        setStackInPlace(false);
      }
      if (opened && !stackViewed) {
        setStackInPlace(true);
      }
    }
  });

  // Cards slide Z spring
  const cardsSlideSpring = useSpring({
    positionZ: opened ? (stackViewed ? 10 : 2.25) : 10,
    config: springConfig,
    delay: !opened ? 0 : 250,
    immediate: stackViewed
  });

  const combinedCardsPosition = useCombinedPosition(
    cardsRotationSpring.positionY, cardsSlideSpring.positionZ
  );

  // Hover animation when pack is closed
  useFrame(({ clock }) => {
    if (!opened && hoverRef.current) {
      const t = clock.getElapsedTime();
      const hoverY = Math.sin(t * 1.2) * 0.08;
      const rotateY = Math.sin(t * 1.2) * 0.05;
      hoverRef.current.position.y += (hoverY - hoverRef.current.position.y) * 0.1;
      hoverRef.current.rotation.y += (rotateY - hoverRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <>
      <a.group 
        rotation={cardsRotationSpring.rotation as unknown as [number, number, number]}
        position={combinedCardsPosition}
        scale={cardsRotationSpring.scale as unknown as [number, number, number]}>
        <CardStack 
          rotator={opened} 
          state={state} 
          stackInPlace={stackInPlace}
          dispatch={dispatch} 
          setStackViewed={setStackViewed} />
      </a.group>

      <a.group 
        rotation={(packRotationSpring as any).rotation}
        position={combinedPackPosition}
        scale={(packRotationSpring as any).scale}>
        <Sparkles 
          position={[0, 2, -0.5]} 
          count={15} 
          size={1}
          scale={[2, 1.5, 0]} 
          color={"#fff"} 
          speed={1} />
        <group ref={hoverRef} >
          <Pack 
            packRef={packRef} 
            rotator={!opened} 
            state={state} 
            dispatch={dispatch} />
        </group>
      </a.group>
    </>
  );
};

export default PackPuller;