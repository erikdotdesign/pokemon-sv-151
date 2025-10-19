import { useState, useRef, useEffect } from "react";
import { TarotCard } from "../widget-src/types";
import Canvas from "./Canvas";
import "./App.css";

const App = () => {
  const [card, setCard] = useState<TarotCard | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      if (msg.type === "card-info") {
        setCard(msg.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    parent.postMessage({ pluginMessage: { type: "ui-open" } }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);
  
  return (
    <main className="c-app">
      <section className="c-app__body">
        <Canvas
          card={card}
          canvasRef={canvasRef} />
      </section>
    </main>
  );
};

export default App;