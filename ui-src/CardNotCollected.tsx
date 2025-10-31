import { a, useTransition } from "@react-spring/web";
import { State } from "./reducer";

const CardNotCollected = ({
  state
}: {
  state: State;
}) => {
  const collected = state.overlay.selectedCardId ? Object.keys(state.collection.cards).includes(state.overlay.selectedCardId) : false;
  const transitions = useTransition(
    state.overlay.collectionVisible && state.overlay.selectedCardId && !collected,
    {
      from: { opacity: 0, transform: `translateY(50%)` },
      enter: { opacity: 1, transform: `translateY(0%)` },
      leave: { opacity: 0, transform: `translateY(50%)` },
      delay: 125,
      config: { tension: 220, friction: 26 },
      immediate: !state.overlay.collectionVisible
    }
  );
  return (
    transitions((style, item) =>
      item && 
      <a.div style={style}>
        <div className="c-canvas__not-collected">Not collected</div>
      </a.div>
    )
  )
};

export default CardNotCollected;