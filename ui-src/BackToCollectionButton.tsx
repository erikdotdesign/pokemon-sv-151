import { a, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import Back from "./svgs/back.svg?react";
import Button from "./Button";

const BackToCollectionButton = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const transitions = useTransition(
    state.overlay.collectionVisible && state.overlay.selectedCardId,
    {
      from: { x: -500 },
      enter: { x: 0 },
      leave: { x: -500 },
      delay: 125,
      config: { tension: 220, friction: 26 },
      immediate: !state.overlay.selectedCardId
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
            dispatch({
              type: "SET_SELECTED_CARD",
              cardId: null
            })
          }}>
          <Back />
        </Button>
      </a.div>
    )
  )
};

export default BackToCollectionButton;