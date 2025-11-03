import { useState, useEffect, useRef } from "react";
import { a, useSpring, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import { collectionIsFiltered } from "./selectors";
import Pokeball from "./svgs/pokeball.svg?react";
import CollectionFiltersButton from "./CollectionFiltersButton";
import CloseCollectionButton from "./CloseCollectionButton";
import ClearFiltersButton from "./ClearFiltersButton";
import Button from "./Button";
import './CollectionNav.css';

const CollectionNav = ({
  scrollRef,
  headerRef,
  state,
  dispatch
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const [sticky, setSticky] = useState(false);
  const collectionFiltered = collectionIsFiltered(state);

  const stickySpring = useSpring({
    transform: sticky ? `translateY(0%)` : `translateY(-110%)`,
    config: { tension: 220, friction: 26 }
  });

  useEffect(() => {
    if (!scrollRef.current || !headerRef.current) return;
    const handleScroll = () => {
      setSticky(scrollRef.current!.scrollTop > headerRef.current!.offsetTop + headerRef.current!.offsetHeight);
    };
    scrollRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollRef.current) scrollRef.current.removeEventListener("scroll", handleScroll);
    }
  }, [state.overlay.collectionVisible]);

  return (
    <a.div className="c-collection-nav" style={stickySpring}>
      <div className="c-collection-nav__inner">
        <div>
          <CloseCollectionButton
            flat
            dispatch={dispatch} />
        </div>
        <div>
          <div className="c-collection-nav__collected">
            <Pokeball />
            <span>{Object.keys(state.collection.cards).length} / {Object.keys(state.cardsById).length}</span>
          </div>
        </div>
        <div>
          {
            collectionFiltered
            ? <ClearFiltersButton
                flat
                state={state}
                dispatch={dispatch} />
            : null
          }
          <CollectionFiltersButton
            flat
            dispatch={dispatch} />
        </div>
      </div>
    </a.div>
  );
};

export default CollectionNav;