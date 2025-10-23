import { Group } from "three";
import CardBody from "./CardBody";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

export const CARD_ASPECT = 733 / 1024;
export const CARD_WIDTH = 2;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
export const CARD_CORNER_RADIUS = 0.15;
export const CARD_DEPTH = 0.32;

const Card = ({ 
  card, 
  cursorPos,
  ...props
}: { 
  card: any | null;
  cursorPos: { x: number; y: number };
} & Group) => {
  const frontFaceDepth = CARD_DEPTH / 2 - 0.145;
  const backFaceDepth = -CARD_DEPTH / 2 + 0.145;
  return (
    <group {...props}>
      <CardBack width={CARD_WIDTH} height={CARD_HEIGHT} depth={backFaceDepth} cornerRadius={CARD_CORNER_RADIUS} />
      <CardBody width={CARD_WIDTH} height={CARD_HEIGHT} depth={CARD_DEPTH} cornerRadius={CARD_CORNER_RADIUS} />
      <CardFront card={card} cursorPos={cursorPos} width={CARD_WIDTH} height={CARD_HEIGHT} depth={frontFaceDepth} cornerRadius={CARD_CORNER_RADIUS} />
    </group>
  );
};

export default Card;