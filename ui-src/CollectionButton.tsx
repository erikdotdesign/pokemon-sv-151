import { a, useSpring, useTransition, to } from "@react-spring/web";
import { Action, State } from "./reducer";
import PokeBall from "./svgs/pokeball.svg?react"
import Button from "./Button";

const CollectionButton = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const transitions = useTransition(
    !state.overlay.collectionVisible && !state.packs.current.opened,
    {
      from: { x: 500 },
      enter: { x: 0 },
      leave: { x: 500 },
      delay: 125,
      config: { tension: 220, friction: 26 }
    }
  );
  return transitions((style, item) =>
    item &&
    <a.div
      style={{
        transform: to(style.x, (x) => `translateX(${x}px)`)
      }}>
      <Button
        modifier={["icon", "circle"]}
        onClick={() =>
          dispatch({
            type: "TOGGLE_COLLECTION_OVERLAY",
            visible: true
          })
        }>
        <PokeBall />
      </Button>
    </a.div>
  );
};

export default CollectionButton;