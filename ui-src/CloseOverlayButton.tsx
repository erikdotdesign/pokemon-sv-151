import { Action, State } from "./reducer";
import Button from "./Button";
import Close from "./svgs/close.svg?react";

const CloseOverlayButton = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    state.overlay.collectionVisible &&
    <Button
      modifier={["icon", "circle"]}
      onClick={() => {
        dispatch({
          type: "TOGGLE_COLLECTION_OVERLAY",
          visible: false
        })
      }}>
      <Close />
    </Button>
  );
};

export default CloseOverlayButton;