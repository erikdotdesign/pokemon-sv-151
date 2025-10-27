import { Card as CardType } from "../reducer";
import CardBody from "./CardBody";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import { RotatorHandle } from "./Rotator";

export const CARD_ASPECT = 733 / 1024;
export const CARD_WIDTH = 2;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
export const CARD_CORNER_RADIUS = 0.15;
export const CARD_BASE_DEPTH = 0.03;
export const CARD_FACE_GAP = 0.001;
export const CARD_FACE_BASE_DEPTH = CARD_BASE_DEPTH / 2;
export const CARD_FRONT_FACE_DEPTH = CARD_FACE_BASE_DEPTH + CARD_FACE_GAP;
export const CARD_BACK_FACE_DEPTH = -CARD_FRONT_FACE_DEPTH;
export const CARD_DEPTH = CARD_BASE_DEPTH + (CARD_FACE_GAP * 2);

const Card = ({ 
  card, 
  rotatorRef
}: { 
  card: CardType;
  rotatorRef: React.RefObject<RotatorHandle | null>;
}) => {
  return (
    <>
      <CardBack 
        width={CARD_WIDTH} 
        height={CARD_HEIGHT} 
        depth={CARD_BACK_FACE_DEPTH} 
        cornerRadius={CARD_CORNER_RADIUS} />
      <CardBody 
        width={CARD_WIDTH} 
        height={CARD_HEIGHT} 
        depth={CARD_BASE_DEPTH} 
        cornerRadius={CARD_CORNER_RADIUS} />
      <CardFront 
        card={card} 
        rotatorRef={rotatorRef} 
        width={CARD_WIDTH} 
        height={CARD_HEIGHT} 
        depth={CARD_FRONT_FACE_DEPTH} 
        cornerRadius={CARD_CORNER_RADIUS} />
    </>
  );
};

export default Card;