import { State } from "./reducer";

export type CollectionRef = {
  addCardToFigma: (cardId: string) => void;
}

const useCollection = (state: State) => {
  const addCardToFigma = async (cardId: string) => {
    const card = state.cardsById[cardId];
    const cardImageUrl = card.images.front;

    try {
      const response = await fetch(cardImageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject("No result from FileReader");
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      parent.postMessage(
        {
          pluginMessage: {
            type: "add-image",
            value: {
              img: base64Url,
              name: card.name
            }
          },
        },
        "*"
      );
    } catch (error) {
      console.error("❌ Failed to fetch or convert image:", error);
    }
  };

  return { addCardToFigma };
};

export default useCollection;