import { useRef } from "react";
import { a, useSpring } from "@react-spring/three";
import { Action, State } from "../reducer";
import { CARD_DEPTH } from "./Card";
import Rotator, { RotatorHandle } from "./Rotator";
import CardStackCard from "./CardStackCard";

const CardStack = ({ 
  state,
  rotator = true,
  dispatch,
  setPackViewed
}: { 
  state: State;
  rotator?: boolean;
  dispatch: (action: Action) => void;
  setPackViewed: (packedViewed: boolean) => void;
}) => {
  const rotatorRef = useRef<RotatorHandle>(null);
  const { current: currentPack } = state.packs;
  const { cards, cardIndex: currentCardIndex, id: currentPackId } = currentPack;

  const handleExitComplete = () => {
    const nextIndex = currentCardIndex + 1;
    dispatch({ type: "SET_CURRENT_PACK_CARD_INDEX", cardIndex: nextIndex });

    if (nextIndex >= cards.length) { // last card
      setPackViewed(true);
    }
  };

  // Shift card group forward by hidden card length
  const { position } = useSpring({
    position: [0, 0, currentCardIndex * CARD_DEPTH],
    config: { mass: 1, tension: 120, friction: 20 },
  });

  return (
    <Rotator 
      ref={rotatorRef}
      disabled={!rotator}>
      <a.group position={position as unknown as [number, number, number]}>
        {cards.map((id, i) => {
          return (
            <CardStackCard
              key={`${currentPackId}-${id}-${i}`}
              id={id}
              renderIndex={i}
              state={state}
              rotatorRef={rotatorRef}
              onExitComplete={handleExitComplete} />
          );
        })}
      </a.group>
    </Rotator>
  );
};

export default CardStack;