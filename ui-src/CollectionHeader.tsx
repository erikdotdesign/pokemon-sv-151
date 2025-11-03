import { Action, State } from "./reducer";
import { collectionIsFiltered, getFilteredCollection } from "./selectors";
import Pokeball from "./svgs/pokeball.svg?react";
import CollectionFiltersButton from "./CollectionFiltersButton";
import CloseCollectionButton from "./CloseCollectionButton";
import ClearFiltersButton from "./ClearFiltersButton";

const CollectionHeader = ({
  headerRef,
  state,
  dispatch
}: {
  headerRef: React.RefObject<HTMLDivElement | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const isFiltered = collectionIsFiltered(state);
  const collection = isFiltered ? getFilteredCollection(state) : Object.keys(state.cardsById);
  return (
    <div className="c-collection__header" ref={headerRef}>
      <div>
        <CloseCollectionButton
          dispatch={dispatch} />
      </div>
      <div>
        <div className="c-collection__collected">
          <Pokeball />
          {
            isFiltered
            ? <span>{collection.length}</span>
            : <span>{Object.keys(state.collection.cards).length} / {Object.keys(state.cardsById).length}</span>
          }
        </div>
      </div>
      <div>
        {
          isFiltered
          ? <ClearFiltersButton
              state={state}
              dispatch={dispatch} />
          : null
        }
        <CollectionFiltersButton
          dispatch={dispatch} />
      </div>
    </div>
  );
};

export default CollectionHeader;