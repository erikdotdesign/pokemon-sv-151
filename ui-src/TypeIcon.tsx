import { PokemonType } from "./reducer";
import Colorless from "./svgs/types/colorless.svg?react";
import Darkness from "./svgs/types/darkness.svg?react";
import Dragon from "./svgs/types/dragon.svg?react";
import Fairy from "./svgs/types/fairy.svg?react";
import Fighting from "./svgs/types/fighting.svg?react";
import Fire from "./svgs/types/fire.svg?react";
import Grass from "./svgs/types/grass.svg?react";
import Lightning from "./svgs/types/lightning.svg?react";
import Metal from "./svgs/types/metal.svg?react";
import Psychic from "./svgs/types/psychic.svg?react";
import Water from "./svgs/types/water.svg?react";

const TypeIcon = ({
  type
}: {
  type: PokemonType;
}) => {
  switch(type) {
    case "COLORLESS":
      return <Colorless />;
    case "DARKNESS":
      return <Darkness />;
    case "DRAGON":
      return <Dragon />;
    case "FAIRY":
      return <Fairy />;
    case "FIGHTING":
      return <Fighting />;
    case "FIRE":
      return <Fire />;
    case "GRASS":
      return <Grass />;
    case "LIGHTNING":
      return <Lightning />;
    case "METAL":
      return <Metal />;
    case "PSYCHIC":
      return <Psychic />;
    case "WATER":
      return <Water />;
  }
};

export default TypeIcon;