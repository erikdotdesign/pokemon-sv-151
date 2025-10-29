import { useState, useEffect } from "react";
import { a, useSpring, to } from "@react-spring/three";
import { Sparkles } from "@react-three/drei";
import { State } from "../reducer";
import { getCardById } from "../selectors";
import { RotatorHandle } from "./Rotator";
import Card, { CARD_DEPTH } from "./Card";

const CardStackCard = ({ 
  id, 
  renderIndex,
  state, 
  rotatorRef, 
  hideBelow,
  stackInPlace,
  setHideBelow,
  onExitComplete,
}: {
  id: string;
  renderIndex: number;
  state: State;
  rotatorRef: React.RefObject<RotatorHandle | null>;
  hideBelow: boolean;
  stackInPlace: boolean;
  setHideBelow: (hideBelow: boolean) => void;
  onExitComplete: () => void;
}) => {
  const { cardIndex: topCardIndex, opened } = state.packs.current;
  const card = getCardById(state, id);
  const { designation } = card.rarity;
  const zPosition = renderIndex * -CARD_DEPTH;
  const [exiting, setExiting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isTopCard = renderIndex === topCardIndex;
  const isSpecialRare = designation === "DOUBLE_RARE" || 
  designation === "HYPER_RARE" || designation === "ILLUSTRATION_RARE" || 
  designation === "SPECIAL_ILLUSTRATION_RARE" || designation === "ULTRA_RARE";

  // exit position animation
  const { position } = useSpring({
    position: exiting ? [10, 0, zPosition] : [0, 0, zPosition],
    config: { mass: 1, tension: 220, friction: 30, duration: 350 },
    onRest: () => {
      if (exiting && onExitComplete) onExitComplete();
    },
  });

  // special rare reveal animation
  const { revealProgress } = useSpring({
    from: { revealProgress: 0 },
    to: revealed ? { revealProgress: 1 } : { revealProgress: 0 },
    config: { duration: 800, easing: (t) => 1 - Math.pow(1 - t, 3) },
    immediate: !revealed,
    onStart: () => {
      if (revealed) setHideBelow(true);
    },
    onRest: () => {
      if (revealed) {
        setRevealed(false);
        setHideBelow(false);
      }
    },
  });

  // special rare reveal animation props
  const rotationY = revealProgress.to([0, 1], [0, Math.PI * 2]);
  const scale = revealProgress.to([0, 0.5, 1], [1, 1.1, 1]);
  const yOffset = revealProgress.to([0, 0.5, 1], [0, 0.25, 0]);
  const sparkleZ = revealProgress.to([0, 0.9, 1], [-6, 0, 6]);

  // trigger special rare reveal animation when top card is special rare
  useEffect(() => {
    if (opened && stackInPlace && isTopCard && isSpecialRare && !revealed) {
      setRevealed(true);
    }
  }, [isTopCard, isSpecialRare, stackInPlace, opened]);

  // trigger exit animation on click
  const handleClick = (e: React.PointerEvent) => {
    if (revealed) return;
    e.stopPropagation();
    if (opened && topCardIndex === renderIndex) setExiting(true);
  };

  // hide animation - hide all other cards during special rare reveal
  const { hiddenProgress } = useSpring({
    hiddenProgress: hideBelow && renderIndex > topCardIndex ? 1 : 0,
    config: { mass: 1, tension: 220, friction: 30 },
    immediate: hideBelow
  });

  // hidden animation props
  const hiddenScale = hiddenProgress.to([0, 1], [1, 0]);

  return (
    <>
      <a.group
        rotation-y={rotationY}
        scale-x={to([scale, hiddenScale], (s, hs) => s * hs)}
        scale-y={to([scale, hiddenScale], (s, hs) => s * hs)}
        scale-z={to([scale, hiddenScale], (s, hs) => s * hs)}
        position={to([position, yOffset], ([x, y, z]: any, offset) => [x, y + offset, z])}
        onClick={handleClick}>
        <Card rotatorRef={rotatorRef} card={card} />
      </a.group>
      {revealed && isSpecialRare && (
        <a.group position-z={sparkleZ}>
          <Sparkles
            size={5}
            color={"#fff"}
            scale={[10, 10, 0]}
            count={50}
            speed={0}
            noise={0}
            opacity={0.9}
          />
          <Sparkles
            size={10}
            color={"#fff"}
            scale={[10, 10, 0]}
            count={10}
            speed={0}
            noise={0}
            opacity={0.9}
          />
        </a.group>
      )}
    </>
  );
};

export default CardStackCard;