import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import Button from "./Button";
import Search from "./svgs/search.svg?react";
import ClearSettings from "./svgs/reset-settings.svg?react";
import Close from "./svgs/close.svg?react";
import Pokeball from "./svgs/pokeball.svg?react";
import CollectionCard from "./CollectionCard";
import './Collection.css';

const Collection = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    state.overlay.collectionVisible &&
    <div className={`c-collection ${state.overlay.selectedCardId ? `c-collection--hidden` : ''}`}>
      <div className="c-collection__header">
        <div>
          <Button modifier={["icon", "circle"]}>
            <Search />
          </Button>
          <Button modifier={["icon", "circle"]}>
            <ClearSettings />
          </Button>
        </div>
        <div>
          <div className="c-collection__collected">
            <Pokeball />
            <span>{Object.keys(state.collection.cards).length} / {Object.keys(state.cardsById).length}</span>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <div className="c-collection__cards">
        {
          Object.keys(state.cardsById).map((id, index) => (
            <CollectionCard
              key={id}
              id={id}
              index={index}
              state={state}
              dispatch={dispatch} />
          ))
        }
      </div>
    </div>
  );
};

export default Collection;