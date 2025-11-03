import { Action, State } from "./reducer";
import Close from "./svgs/close.svg?react";
import SearchIcon from "./svgs/search.svg?react";
import Button from "./Button";

const CollectionQueryFilter = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const { filters } = state.overlay;
  return (
    <div className="c-collection-sidebar__section">
      <div className={`c-collection-sidebar__search ${filters.query ? "c-collection-sidebar__search--active" : ''}`}>
        <SearchIcon />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => {
            dispatch({
              type: "SET_COLLECTION_FILTER",
              filters: {
                ...filters,
                query: e.target.value
              }
            })
          }} />
        {
          filters.query
          ? <Button 
              modifier={["icon", "flat", "circle", "bare", "small"]}
              onClick={() => {
                dispatch({
                  type: "SET_COLLECTION_FILTER",
                  filters: {
                    ...filters,
                    query: ''
                  }
                })
              }}>
              <Close />
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default CollectionQueryFilter;