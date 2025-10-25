import { useRef, useReducer } from "react";
import reducer, { Card, State } from "./reducer";
import { getPackCards } from "./selectors";
import cardData from "./data/cards_merged.json";
import usePluginStorage from "./usePluginStorage";
import Canvas from "./Canvas";
import "./App.css";

const CARDS_BY_ID = Object.fromEntries(
  cardData.map(card => [card.ext.tcgl.cardID, card as Card])
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    view: "packs",
    packs: {
      current: {
        cards: getPackCards({ cardsById: CARDS_BY_ID } as State),
        opened: false,
        cardIndex: 0
      },
      available: Infinity,
      lastOpened: null
    },
    collection: {
      cards: []
    },
    cardsById: CARDS_BY_ID,
    hydrated: false
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  usePluginStorage(
    state, 
    dispatch
  );
  
  return (
    <main className="c-app">
      <section className="c-app__body">
        <Canvas
          state={state}
          dispatch={dispatch}
          canvasRef={canvasRef} />
      </section>
    </main>
  );
};

export default App;