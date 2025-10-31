import { useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { Action, State } from "../reducer";
import { getPackCards, getGodPack, displayPack } from "../selectors";

import CardStack from "./CardStack";

const springConfig = { mass: 1, tension: 170, friction: 26 };

const PackViewerCards = ({ 
  state, 
  setPackRecycle,
  dispatch,
}: { 
  state: State; 
  setPackRecycle: (packRecycle: boolean) => void;
  dispatch: (action: Action) => void;
}) => {
  const { opened } = state.packs.current;
  const [stackInPlace, setStackInPlace] = useState(false);
  const [stackViewed, setStackViewed] = useState(false);

  // Cards rotation & scale spring
  const cardsRotationSpring = useSpring({
    rotationX: opened ? (stackViewed ? -Math.PI/2 : 0) : -Math.PI/2,
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
    positionZ: opened ? (stackViewed ? 10 : 0) : 10,
    config: springConfig,
    delay: !opened ? 0 : 250,
    immediate: stackViewed
  });

  return (
    <group position-z={2.25}>
      <a.group 
        rotation-x={cardsRotationSpring.rotationX}
        position-y={cardsRotationSpring.positionY}
        position-z={cardsSlideSpring.positionZ}
        scale={cardsRotationSpring.scale as unknown as [number, number, number]}>
        <CardStack 
          rotator={opened} 
          state={state} 
          stackInPlace={stackInPlace}
          dispatch={dispatch} 
          setStackViewed={setStackViewed} />
      </a.group>
    </group>
  );
};

export default PackViewerCards;