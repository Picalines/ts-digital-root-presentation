import { Code, makeScene2D, Txt, CODE } from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  createRef,
  createSignal,
  Direction,
  easeOutCubic,
  range,
  sequence,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { joinIter } from "../lib";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} fill="white" fontSize={100}>
      Только не точь в точь!
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* beginSlide("chapter-title");

  yield* title().opacity(0, 0.5);

  const code = createRef<Code>();

  const lookUpType = Code.createSignal("Lookup");
  const itemType = Code.createSignal("Item");
  const lookUpValues = [0, 2, 9, 4, 3];
  const lookUpIndex = createSignal(0);

  const luIndexCode = Code.createSignal(() =>
    Math.floor(lookUpIndex()).toString(),
  );
  const luValueCode = Code.createSignal(() =>
    lookUpValues[Math.floor(lookUpIndex())].toString(),
  );

  view.add(
    <Code
      ref={code}
      opacity={0}
      fontSize={50}
      code={CODE`\
type ${lookUpType} = [${lookUpValues.join(", ")}]
type ${itemType} = ${lookUpType}[${luIndexCode}] // ${luValueCode}`}
    />,
  );

  yield* code().opacity(1, 0.5);

  yield* beginSlide("ts-array-lookup");

  yield* all(lookUpType("CheatSheet", 1), itemType("Solution", 1));

  yield* lookUpIndex(lookUpValues.length - 1, 1);
  yield* waitFor(0.5);
  yield* lookUpIndex(2, 0.5);

  yield* beginSlide("cheat-sheet-idea");

  const addTableBody = Code.createSignal("\n  // ...");

  yield* code().code(
    CODE`\
type AddTable = [${addTableBody}
]`,
    1,
  );

  yield* waitFor(0.5);

  yield* all(
    addTableBody(
      range(10).map((d) => `\n  [] // ${d}`),
      1,
    ),
    code().fontSize(40, 1),
  );

  yield* waitFor(1);

  const addTableCells = range(10).map(() =>
    range(10).map((x) => {
      const digitSum = createSignal(0);

      const code = Code.createSignal(() => {
        const literal = Math.floor(digitSum()).toString();
        return x > 0 ? literal.padStart(3, " ") : literal;
      });

      return { digitSum, code };
    }),
  );

  yield* addTableBody(
    range(10).map(
      (d) =>
        CODE`\n  [${[
          ...joinIter(
            addTableCells[d].map((c) => c.code),
            ", ",
          ),
        ]}] // ${d.toString()}`,
    ),
    1,
  );

  yield* sequence(
    0.1,
    ...addTableCells.map((row, d1) =>
      all(
        ...row.map(({ digitSum }, d2) => digitSum(d1 + d2, 0.5, easeOutCubic)),
      ),
    ),
  );

  yield* code().fontSize(45, 1);

  yield* code().code.append(
    "\n\ntype AddDigits<D1 extends Digit, D2 extends Digit>\n  = AddTable[D1][D2]",
    1,
  );

  yield* beginSlide("add-table");
});
