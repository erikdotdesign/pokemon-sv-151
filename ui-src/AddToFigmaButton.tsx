import { a, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import Button from "./Button";
import FigmaLogo from "./svgs/figma-logo.svg?react";
import { CollectionRef } from "./useCollection";

const AddToFigmaButton = ({
  collectionRef,
  state,
  dispatch
}: {
  collectionRef: CollectionRef;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const collected = state.overlay.selectedCardId ? Object.keys(state.collection.cards).includes(state.overlay.selectedCardId) : false;
  const transitions = useTransition(
    state.overlay.collectionVisible && state.overlay.selectedCardId && collected,
    {
      from: { x: 500 },
      enter: { x: 0 },
      leave: { x: 500 },
      delay: 125,
      config: { tension: 220, friction: 26 },
      immediate: !state.overlay.collectionVisible
    }
  );
  return (
    transitions((style, item) =>
      item && 
      <a.div
        style={{
          transform: to(style.x, (x) => `translateX(${x}px)`)
        }}>
        <Button
          modifier={["icon", "circle"]}
          onClick={() => {
            collectionRef.addCardToFigma(state.overlay.selectedCardId!);
          }}>
          <FigmaLogo />
        </Button>
      </a.div>
    )
  )
};

export default AddToFigmaButton;