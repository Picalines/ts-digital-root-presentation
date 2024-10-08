import { makeProject } from "@motion-canvas/core";
import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser as jsParser } from "@lezer/javascript";

import introduction from "./scenes/introduction?scene";
import tsMath from "./scenes/ts-math?scene";
import addingDigits from "./scenes/adding-digits?scene";
import digitalRootProperties from "./scenes/digital-root-properties?scene";
import tsInfer from "./scenes/ts-infer?scene";
import puttingPiecesTogether from "./scenes/putting-pieces-together?scene";

Code.defaultHighlighter = new LezerHighlighter(
  jsParser.configure({
    dialect: "tsx ts",
  }),
);

export default makeProject({
  scenes: [
    introduction,
    tsMath,
    addingDigits,
    digitalRootProperties,
    tsInfer,
    puttingPiecesTogether,
  ],
});
