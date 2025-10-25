import { useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { Action, State, Card as CardType } from "../reducer";
import { getCardById } from "../selectors";
import CardRotator from "./CardRotator";
import Card, { CARD_DEPTH, CARD_WIDTH, CARD_HEIGHT } from "./Card";

const AnimatedCard = ({ 
  card, 
  position, 
  cursorPos, 
  isTop,
  onExitComplete 
}: {
  card: CardType;
  position: [number, number, number];
  cursorPos: { x: number; y: number };
  isTop: boolean;
  onExitComplete: () => void;
}) => {
  const [exiting, setExiting] = useState(false);

  const { pos } = useSpring({
    pos: exiting ? [10, 0, position[2]] : position,
    config: { mass: 1, tension: 220, friction: 30, duration: 350 },
    onRest: () => {
      if (exiting && onExitComplete) onExitComplete();
    },
  });

  const handleClick = () => {
    if (isTop) setExiting(true);
  }

  return (
    <animated.group position={pos} onClick={handleClick}>
      <Card cursorPos={cursorPos} card={card} />
    </animated.group>
  );
};

const CardStack = ({ 
  state,
  dispatch,
  setPackViewed
}: { 
  state: State;
  dispatch: (action: Action) => void;
  setPackViewed: (packedViewed: boolean) => void;
}) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { cards, cardIndex } = state.packs.current;
  const visibleCards = cards.slice(cardIndex); // only show cards from current index onward

  const handleExitComplete = () => {
    dispatch({ type: "SET_CURRENT_PACK_CARD_INDEX", cardIndex: cardIndex + 1 });
    if (visibleCards.length <= 1) {
      setPackViewed(true);
    }
  };

  return (
    <CardRotator
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      padding={0.6}
      setCursorPos={setCursorPos}>
      {visibleCards.reverse().map((id, i) => {
        const isTop = i === visibleCards.length - 1;
        const card = getCardById(state, id);
        return (
          <AnimatedCard
            key={id}
            card={card}
            position={[0, 0, -i * (CARD_DEPTH / 2 - 0.18)]}
            cursorPos={cursorPos}
            isTop={isTop}
            onExitComplete={handleExitComplete} />
        );
      })}
    </CardRotator>
  );
};

export default CardStack;