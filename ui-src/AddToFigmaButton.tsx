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
  return (
    state.overlay.collectionVisible && state.overlay.selectedCardId && collected && 
    <Button
      modifier={["icon", "circle"]}
      onClick={() => {
        collectionRef.addCardToFigma(state.overlay.selectedCardId!);
      }}>
      <FigmaLogo />
    </Button>
  );
};

export default AddToFigmaButton;