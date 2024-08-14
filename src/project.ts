import { makeProject } from "@motion-canvas/core";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import introduction from "./scenes/introduction?scene";
import { parser as jsParser } from "@lezer/javascript";

Code.defaultHighlighter = new LezerHighlighter(
  jsParser.configure({
    dialect: "tsx ts",
  }),
);

export default makeProject({
  scenes: [introduction],
});
