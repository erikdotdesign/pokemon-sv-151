import { Action, State } from "./reducer";
import { getCollectionFilterCount, getFilteredCollection } from "./selectors";
import Close from "./svgs/close.svg?react";
import ClearFiltersButton from "./ClearFiltersButton";
import Button from "./Button";

const CollectionSidebarHeader = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const activeFilters = getCollectionFilterCount(state);
  const filteredCollection = getFilteredCollection(state);
  return (
    <div className="c-collection-sidebar__header">
      <ClearFiltersButton
        state={state}
        dispatch={dispatch} />
      <div className="c-collection-sidebar__details">
        <h5>Collection Filters</h5>
        <span>
          {activeFilters} {activeFilters === 1 ? `filter` : `filters`}
          {
            activeFilters
            ? <span> • {filteredCollection.length} {filteredCollection.length === 1 ? `result` : `results`}</span>
            : null
          }
        </span>
      </div>
      <Button 
        modifier={["icon", "circle"]}
        onClick={() => {
          dispatch({
            type: "TOGGLE_FILTERS_OVERLAY",
            visible: false
          })
        }}>
        <Close />
      </Button>
    </div>
  );
};

export default CollectionSidebarHeader;