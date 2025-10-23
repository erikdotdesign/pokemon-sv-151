import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import CardRotator from "./CardRotator";
import Card, { CARD_DEPTH, CARD_WIDTH, CARD_HEIGHT } from "./Card";

const AnimatedCard = ({ card, position, cursorPos, onRemove }: any) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const { pos } = useSpring({
    pos: isRemoving ? [5, 0, position[2]] : position, // slide x offscreen when removing
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
    <animated.mesh position={pos} onClick={handleClick}>
      <Card cursorPos={cursorPos} card={card} />
    </animated.mesh>
  );
};

const CardStack = ({ 
  cards: initialCards,
  setView,
  isFlipped = false
}: { 
  cards: any[] | null; 
  setView: (view: any) => void;
  isFlipped?: boolean 
}) => {
  const [cards, setCards] = useState(initialCards || []);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(isFlipped);

  const removeTopCard = () => {
    setCards((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    cards.length === 0 ? setView("pack") : null;
  }, [cards]);

  return (
    <CardRotator
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      padding={0.6}
      setCursorPos={setCursorPos}
      flipped={flipped}
      setFlipped={setFlipped}>
      {cards.map((card, i) => {
        const isTop = i === cards.length - 1;
        return (
          <AnimatedCard
            key={card.ext.tcgl.cardID}
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