import { useState } from "react";
import CardRotator from "./CardRotator";
import CardBody from "./CardBody";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import CardGlare from "./CardGlare";

const Card = ({ 
  card, 
  isFlipped = false 
}: { 
  card?: any | null;
  isFlipped?: boolean
}) => {
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(isFlipped);
  const aspect = 733 / 1024;
  const width = 2.5;
  const height = width / aspect;
  const depth = 0.35;
  const cornerRadius = 0.15;
  const hitTargetPadding = 0.4;
  const frontFaceDepth = depth / 2 - 0.145;
  const backFaceDepth = -depth / 2 + 0.145;
  return (
    <CardRotator
      width={width}
      height={height}
      padding={hitTargetPadding}
      setGlarePos={setGlarePos}
      flipped={flipped}
      setFlipped={setFlipped}>
      <CardBack width={width} height={height} depth={backFaceDepth} cornerRadius={cornerRadius} />
      <CardBody width={width} height={height} depth={depth} cornerRadius={cornerRadius} />
      <CardFront width={width} height={height} depth={frontFaceDepth} cornerRadius={cornerRadius} />
      <CardGlare flipped={flipped} glarePos={glarePos} width={width} height={height} depth={frontFaceDepth} cornerRadius={cornerRadius} />
    </CardRotator>
  );
};

export default Card;