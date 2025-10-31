import * as THREE from "three";
import { a, useTransition } from "@react-spring/three";
import { Action, Card, State } from "../reducer";

import PackViewer from "./PackViewer";
import CardViewer from "./CardViewer";

const ViewerRouter = ({ 
  packRef,
  state,
  dispatch
}: { 
  packRef: React.RefObject<THREE.Mesh | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {

  const items: { view: string, card?: Card, collected?: boolean }[] = state.overlay.selectedCardId
    ? [{
        view: "card", 
        card: state.cardsById[state.overlay.selectedCardId], 
        collected: Object.keys(state.collection.cards).includes(state.overlay.selectedCardId)
      }]
    : !state.overlay.collectionVisible
    ? [{view: "pack"}]
    : [{view: "none"}];

  const transitions = useTransition(items, {
    keys: item => item.view,
    from: item => {
      if(item.view === "pack") return { positionY: 10 };
      if(item.view === "card") return { positionX: -10 };
      return {};
    },
    enter: item => {
      if(item.view === "pack") return { positionY: 0 };
      if(item.view === "card") return { positionX: 0 };
      return {};
    },
    leave: item => {
      if(item.view === "pack") return { positionY: 10 };
      if(item.view === "card") return { positionX: -10 };
      return {};
    },
    config: { tension: 170, friction: 26 },
    delay: 350
  });

  return transitions((style, item) => {
    switch (item.view) {
      case "pack":
        return (
          <a.group position-y={(style as { positionY: number }).positionY}>
            <PackViewer
              state={state}
              dispatch={dispatch}
              packRef={packRef}
            />
          </a.group>
        );
      case "card":
        return (
          <a.group position-x={(style as { positionX: number }).positionX}>
            <CardViewer
              card={item.card!}
              collected={item.collected!}
            />
          </a.group>
        );
      default:
        return null;
    }
  });
};

export default ViewerRouter;