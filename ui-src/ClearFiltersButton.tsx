import { Action, State } from "./reducer";
import { collectionIsFiltered } from "./selectors";
import ResetSettings from "./svgs/reset-settings.svg?react";
import Button from "./Button";
import './Collection.css';

const ClearFiltersButton = ({
  flat = false,
  state,
  dispatch
}: {
  flat?: boolean,
  state: State,
  dispatch: (action: Action) => void;
}) => {
  const isActive = collectionIsFiltered(state);
  return (
    <Button 
      modifier={["icon", "circle", ...(flat ? ["flat"] : []), ...(isActive ? ["primary"] : [])]}
      disabled={!isActive}
      onClick={() => {
        dispatch({
          type: "CLEAR_COLLECTION_FILTERS"
        })
      }}>
      <ResetSettings />
    </Button>
  );
};

export default ClearFiltersButton;