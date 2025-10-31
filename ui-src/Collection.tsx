import { a, useSpring, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import Search from "./svgs/search.svg?react";
import ClearSettings from "./svgs/reset-settings.svg?react";
import Close from "./svgs/close.svg?react";
import Pokeball from "./svgs/pokeball.svg?react";
import CollectionCard from "./CollectionCard";
import Button from "./Button";
import './Collection.css';

const Collection = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const transitions = useTransition(state.overlay.collectionVisible, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
  });

  const hideSpring = useSpring({
    x: state.overlay.selectedCardId ? -100 : 0,
  });
  return (
    <>
      {transitions((transitionStyle, item) =>
        item &&
        <a.div 
          className="c-collection" 
          style={{
            transform: to(
              [transitionStyle.transform, hideSpring.x],
              (t, x) => `${t} translateX(${x}%)`
            ),
            pointerEvents: state.overlay.selectedCardId ? "none" : "auto",
          }}>
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
        </a.div>
      )}
    </>
  );
};

export default Collection;