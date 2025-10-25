import { a, useSpring } from "@react-spring/three";
import { Action, State } from "../reducer";
import { getPackCards, getRandomRareCards } from "../selectors";

import Pack from "./Pack";
import CardStack from "./CardStack";
import { useState } from "react";

const PackViewer = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const { opened } = state.packs.current;
  const [packViewed, setPackViewed] = useState(false);

  const packSpring = useSpring({
    from: { position: [0, 10, 1.5] },
    to: {
      position: opened ? [0, 10, 1.5] : [0, 0, 1.5]
    },
    config: { mass: 1, tension: 170, friction: 26 }
  });

  const cardsSpring = useSpring({
    position: opened ? (packViewed ? [-10,0,2] : [0,0,2]) : [-10,0,2],
    config: { mass: 1, tension: 170, friction: 26 },
    immediate: packViewed,
    onRest: () => {
      if (packViewed) {
        dispatch({ type: "SET_NEW_CURRENT_PACK", cards: getRandomRareCards(state) });
        setPackViewed(false);
      }
    }
  });

  return (
    <>
      <a.group {...cardsSpring}>
        <CardStack state={state} dispatch={dispatch} setPackViewed={setPackViewed} />
      </a.group>
      <a.group {...packSpring}>
        <Pack state={state} dispatch={dispatch} />
      </a.group>
    </>
  );
};

export default PackViewer;