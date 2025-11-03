import { Action, State } from "./reducer";
import { collectionIsFiltered, getFilteredCollection } from "./selectors";
import CollectionCard from "./CollectionCard";

const CollectionCards = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const isFiltered = collectionIsFiltered(state);
  const collection = isFiltered ? getFilteredCollection(state) : Object.keys(state.cardsById);
  return (
    <div className="c-collection__cards">
      {
        collection.map((id) => (
          <CollectionCard
            key={id}
            id={id}
            index={Object.keys(state.cardsById).indexOf(id)}
            state={state}
            dispatch={dispatch} />
        ))
      }
    </div>
  );
};

export default CollectionCards;