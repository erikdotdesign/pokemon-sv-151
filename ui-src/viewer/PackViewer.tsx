import { a, useSpring } from "@react-spring/three";
import { Action, State } from "../reducer";

import Pack from "./Pack";
import CardStack from "./CardStack";

const PackViewer = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const { opened } = state.packs.current;

  const packSpring = useSpring({
    scale: opened ? [0,0,0] : [1,1,1],
    position: opened ? [0, -10, 1.5] : [0, 0, 1.5],
    config: { mass: 1, tension: 170, friction: 26 }
  });

  const cardsSpring = useSpring({
    scale: opened ? [1,1,1] : [0,0,0],
    position: opened ? [0, 0, 2] : [0, -10, 2],
    config: { mass: 1, tension: 170, friction: 26 },
    immediate: !opened
  });

  return (
    <>
      <a.group {...cardsSpring}>
        <CardStack state={state} dispatch={dispatch} />
      </a.group>
      <a.group {...packSpring}>
        <Pack state={state} dispatch={dispatch} />
      </a.group>
    </>
  );
};

export default PackViewer;