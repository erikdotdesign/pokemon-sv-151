import { useRef } from "react";
import { a, useSpring, to } from "@react-spring/three";
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
  const card = state.cardsById[state.overlay.selectedCardId!];
  return (
    <a.group>
      <Rotator ref={rotatorRef}>
        <Card 
          rotatorRef={rotatorRef}
          card={card} />
      </Rotator>
    </a.group>
  );
};

export default CardViewer;