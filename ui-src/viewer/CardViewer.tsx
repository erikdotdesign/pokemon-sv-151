import { useRef } from "react";
import { a, useSpring, to, useTransition } from "@react-spring/three";
import { Action, Card as CardType, State } from "../reducer";

import Rotator, { RotatorHandle } from "./Rotator";
import Card from "./Card";

const CardViewer = ({ 
  card, 
  collected
}: { 
  card: CardType;
  collected: boolean;
}) => {
  const rotatorRef = useRef<RotatorHandle>(null);

  return (
    <group position-z={2.25} rotation-y={collected ? 0 : Math.PI}>
      <Rotator ref={rotatorRef}>
        <Card rotatorRef={rotatorRef} card={card} />
      </Rotator>
    </group>
  )
};

export default CardViewer;