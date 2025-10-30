import { Action, State } from "./reducer";
import PokeBall from "./svgs/pokeball.svg?react"
import Button from "./Button";

const CollectionButton = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Button 
      modifier={["icon", "circle"]}
      onClick={() => {
        dispatch({
          type: "TOGGLE_COLLECTION_OVERLAY",
          visible: true
        })
      }}>
      <PokeBall />
    </Button>
  );
};

export default CollectionButton;