import { useRef } from "react";
import { a, useSpring, to, useTransition } from "@react-spring/three";
import { Action, State } from "../reducer";

import Rotator, { RotatorHandle } from "./Rotator";
import Card from "./Card";

const CardViewer = ({ 
  state, 
  dispatch,
}: { 
  state: State; 
  dispatch: (action: Action) => void;
}) => {
  const rotatorRef = useRef<RotatorHandle>(null);

  const selectedCardId = state.overlay.selectedCardId;
  const collected = selectedCardId 
    ? Object.keys(state.collection.cards).includes(selectedCardId) 
    : false;

  // useTransition handles mounting/unmounting animations
  const transitions = useTransition(selectedCardId, {
    from: { positionX: -10, positionZ: 2.25, rotateY: collected ? 0 : Math.PI },
    enter: { positionX: 0, positionZ: 2.25, rotateY: collected ? 0 : Math.PI },
    leave: { positionX: 0, positionZ: -5, rotateY: collected ? 0 : Math.PI },
    config: { tension: 170, friction: 26 },
    delay: 350,
    immediate: !selectedCardId
  });

  return transitions(
    (style, cardId) =>
      cardId && (
        <a.group position-x={style.positionX} position-z={style.positionZ} rotation-y={style.rotateY}>
          <Rotator ref={rotatorRef}>
            <Card rotatorRef={rotatorRef} card={state.cardsById[cardId]} />
          </Rotator>
        </a.group>
      )
  );
};

export default CardViewer;