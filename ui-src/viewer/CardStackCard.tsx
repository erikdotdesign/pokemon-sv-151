import { useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { State } from "../reducer";
import { getCardById } from "../selectors";
import { RotatorHandle } from "./Rotator";
import Card, { CARD_DEPTH } from "./Card";

const CardStackCard = ({ 
  id, 
  renderIndex,
  state, 
  rotatorRef, 
  onExitComplete 
}: {
  id: string;
  renderIndex: number;
  state: State;
  rotatorRef: React.RefObject<RotatorHandle | null>;
  onExitComplete: () => void;
}) => {
  const { cardIndex: topCardIndex, opened } = state.packs.current;
  const card = getCardById(state, id);
  const zPosition = renderIndex * -CARD_DEPTH;
  const [exiting, setExiting] = useState(false);

  const { position } = useSpring({
    position: exiting ? [10, 0, zPosition] : [0, 0, zPosition],
    config: { mass: 1, tension: 220, friction: 30, duration: 350 },
    onRest: () => {
      if (exiting && onExitComplete) onExitComplete();
    }
  });

  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (opened && topCardIndex === renderIndex) setExiting(true);
  };

  return (
    <a.group 
      position={position as unknown as [number, number, number]} 
      onClick={handleClick}>
      <Card rotatorRef={rotatorRef} card={card} />
    </a.group>
  );
};

export default CardStackCard;