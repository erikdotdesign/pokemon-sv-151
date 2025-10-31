import { useState, useEffect, useRef } from "react";
import { a, useSpring, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import Search from "./svgs/search.svg?react";
import ClearSettings from "./svgs/reset-settings.svg?react";
import Back from "./svgs/back.svg?react";
import Pokeball from "./svgs/pokeball.svg?react";
import CollectionCard from "./CollectionCard";
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

  const stickySpring = useSpring({
    transform: sticky ? `translateY(0%)` : `translateY(-100%)`,
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
          <Button 
            modifier={["icon", "circle", "flat"]}
            onClick={() => {
              dispatch({
                type: "TOGGLE_COLLECTION_OVERLAY",
                visible: false
              })
            }}>
            <Back />
          </Button>
        </div>
        <div>
          <div className="c-collection-nav__collected">
            <Pokeball />
            <span>{Object.keys(state.collection.cards).length} / {Object.keys(state.cardsById).length}</span>
          </div>
        </div>
        <div>
          {/* <Button modifier={["icon", "circle", "flat"]}>
            <ClearSettings />
          </Button>
          <Button modifier={["icon", "circle", "flat"]}>
            <Search />
          </Button> */}
        </div>
      </div>
    </a.div>
  );
};

export default CollectionNav;