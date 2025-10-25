import { animated, useSpring } from "@react-spring/three";
import { Card } from "../reducer";

const CardStackCard = ({ 
  card, 
  position, 
  cursorPos, 
  isExiting, 
  onClick, 
  onExitComplete 
}: {
  card: Card;
  position: [number, number, number];
  cursorPos: { x: number; y: number };
  isExiting: boolean;
  onClick: () => void;
  onExitComplete: () => void;
}) => {
  const { pos } = useSpring({
    pos: isExiting ? [10, 0, position[2]] : position,
    config: { mass: 1, tension: 220, friction: 30, duration: 350 },
    onRest: () => {
      if (isExiting && onExitComplete) onExitComplete();
    },
  });

  return (
    <animated.group position={pos} onClick={onClick}>
      <Card cursorPos={cursorPos} card={card} />
    </animated.group>
  );
};

export default CardStackCard;