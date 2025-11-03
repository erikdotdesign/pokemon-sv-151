import { useEffect, useRef } from "react";
import { a, useSpring, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import CollectionNav from "./CollectionNav";
import CollectionSidebar from "./CollectionSidebar";
import CollectionHeader from "./CollectionHeader";
import CollectionCards from "./CollectionCards";
import './Collection.css';

const COLLECTION_TRANSLATE = 110; 

const Collection = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const { filters } = state.overlay;
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const transitions = useTransition(state.overlay.collectionVisible, {
    from: { transform: `translateX(${COLLECTION_TRANSLATE}%)` },
    enter: { transform: "translateX(0%)" },
    leave: { transform: `translateX(${COLLECTION_TRANSLATE}%)` },
  });

  const hideSpring = useSpring({
    x: state.overlay.selectedCardId ? -COLLECTION_TRANSLATE : 0,
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({top: 0, behavior: "instant"});
  }, [filters.query, filters.rarities, filters.types]);
  
  return (
    transitions((transitionStyle, item) =>
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
        <CollectionNav 
          scrollRef={scrollRef}
          headerRef={headerRef}
          state={state} 
          dispatch={dispatch} />
        <CollectionSidebar
          state={state} 
          dispatch={dispatch} />
        <div className="c-collection__inner" ref={scrollRef} >
          <CollectionHeader
            headerRef={headerRef}
            state={state}
            dispatch={dispatch} />
          <CollectionCards
            state={state}
            dispatch={dispatch} />
        </div>
      </a.div>
    )
  );
};

export default Collection;