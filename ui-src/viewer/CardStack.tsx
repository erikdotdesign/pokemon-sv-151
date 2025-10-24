import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { Action, State } from "../reducer";
import { getCardById, getRandomCardIds } from "../selectors";
import CardRotator from "./CardRotator";
import Card, { CARD_DEPTH, CARD_WIDTH, CARD_HEIGHT } from "./Card";

const AnimatedCard = ({ 
  card, 
  position, 
  cursorPos, 
  onRemove 
}: any) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const { pos } = useSpring({
    pos: isRemoving ? [10, 0, position[2]] : position,
    config: { mass: 1, tension: 220, friction: 30 },
    onRest: () => {
      if (isRemoving && onRemove) onRemove();
    },
  });

  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
  };

  return (
    <animated.group position={pos} onClick={handleClick}>
      <Card cursorPos={cursorPos} card={card} />
    </animated.group>
  );
};

const CardStack = ({ 
  state,
  dispatch,
  isFlipped = false
}: { 
  state: State;
  dispatch: (action: Action) => void;
  isFlipped?: boolean;
}) => {
  const [cards, setCards] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(isFlipped);

  const removeTopCard = () => {
    if (cards.length === 1) {
      const newCards = getRandomCardIds(state);
      dispatch({
        type: "SET_CURRENT_PACK",
        cards: newCards
      });
    } else {
      setCards((prev) => prev.slice(0, -1));
    }
  };

  // set cards in useEffect to prevent render flash before animation
  useEffect(() => {
    setCards(state.packs.current.cards);
  }, [state.packs.current.cards]);

  return (
    <CardRotator
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      padding={0.6}
      setCursorPos={setCursorPos}
      flipped={flipped}
      setFlipped={setFlipped}>
      {cards.map((id, i) => {
        const isTop = i === cards.length - 1;
        const card = getCardById(state, id);
        return (
          <AnimatedCard
            key={id}
            card={card}
            position={[0, 0, i * (-CARD_DEPTH / 2 + 0.18)]}
            cursorPos={cursorPos}
            onRemove={isTop ? removeTopCard : undefined} />
        );
      })}
    </CardRotator>
  );
};

export default CardStack;