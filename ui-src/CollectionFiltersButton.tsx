import { Action, State } from "./reducer";
import Search from "./svgs/search.svg?react";
import Button from "./Button";
import './Collection.css';

const CollectionFiltersButton = ({
  flat = false,
  dispatch
}: {
  flat?: boolean,
  dispatch: (action: Action) => void;
}) => {
  return (
    <Button 
      modifier={["icon", "circle", ...(flat ? ["flat"] : [])]}
      onClick={() => {
        dispatch({
          type: "TOGGLE_FILTERS_OVERLAY",
          visible: true
        })
      }}>
      <Search />
    </Button>
  );
};

export default CollectionFiltersButton;