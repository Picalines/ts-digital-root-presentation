import {
  Latex,
  Line,
  makeScene2D,
  Txt,
  Node,
  Code,
  CODE,
  replace,
} from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  chain,
  createRef,
  createSignal,
  DEFAULT,
  Direction,
  easeOutCubic,
  linear,
  range,
  remap,
  sequence,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { digitalRoot, joinIter } from "../lib";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} fill="white" fontSize={100}>
      Цифровой корень... без суммы?
    </Txt>,
  );

  yield* chain(
    slideTransition(Direction.Bottom, 2),
    beginSlide("chapter-title"),
    title().opacity(0, 0.5),
  );

  const tex = createRef<Latex>();

  view.add(
    <Latex
      ref={tex}
      fill="white"
      tex={"{{dr}}(n) = n \\mid 0 \\le n \\le 9"}
      opacity={0}
    />,
  );

  yield* tex().opacity(1, 0.5);

  const numberLine = createRef<Line>();

  yield* beginSlide("dr-identity-property");

  const notchCount = 10;
  const notchPadding = 200;
  const notches = range(notchCount).map((i) => ({
    i,
    x: createSignal(() =>
      remap(
        0,
        9,
        -view.width() / 2 + notchPadding,
        view.width() / 2 - notchPadding,
        i,
      ),
    ),
    drawn: createSignal(0),
    value: createSignal(i),
  }));

  const ruler = createRef<Node>();

  view.add(
    <Node ref={ruler} opacity={0.5}>
      <Line
        ref={numberLine}
        stroke="white"
        lineWidth={3}
        points={[
          [-view.width() / 2, 0],
          [view.width() / 2, 0],
        ]}
        end={0}
      />
      {range(notchCount).flatMap((i) => [
        <Line
          stroke="white"
          lineWidth={3}
          points={() => {
            const { x, drawn } = notches[i];
            return [
              [x(), drawn() * -10],
              [x(), drawn() * 10],
            ];
          }}
        />,
        <Latex
          fill="white"
          position={() => [notches[i].x(), 40] as [number, number]}
          fontSize={30}
          opacity={() => notches[i].drawn()}
          tex={() => Math.floor(notches[i].value()).toString()}
        />,
      ])}
    </Node>,
  );

  yield* chain(
    all(numberLine().end(1, 1), tex().y(-100, 1, easeOutCubic)),
    sequence(0.05, ...notches.map(({ drawn }) => drawn(1, 0.5))),
  );

  const currentNotch = createSignal(0);

  const autoTex = createSignal(() => {
    const i = Math.round(currentNotch());
    const { value: notchValue } = notches[i];
    const value = Math.floor(notchValue());
    return `{{dr(}}${value}{{) = }}${digitalRoot(value)}`;
  });

  yield* tex().tex(autoTex(), 1);
  tex().tex(() => autoTex());

  for (const iStep of range(2)) {
    yield* chain(
      ...[...notches, notches[0]].map(({ i: iNotch, x: notchX }) =>
        chain(
          all(currentNotch(iNotch, 0.75), tex().position.x(notchX(), 0.75)),
          waitFor(0.1),
        ),
      ),
    );

    yield* beginSlide(`dr-values-${iStep}`);

    yield* chain(
      all(...notches.map(({ value }) => value(10 + value(), 1, linear))),
      waitFor(0.1),
    );

    yield* beginSlide(`dr-shift-${iStep}`);
  }

  tex().tex(autoTex());

  yield* all(ruler().opacity(0, 1), tex().position(0, 1));

  yield* tex().tex(
    "{{dr(}}n{{) = }}\\begin{cases}n \\bmod 9, n \\bmod 9 \\ne 0\\\\9, n \\bmod 9 = 0\\end{cases}",
    1,
  );

  yield* beginSlide("define-dr-by-mod");

  yield* tex().tex("{{dr(}}n{{) = }} 1 + (n - 1) \\bmod 9", 1);

  yield* beginSlide("shorter-dr-by-mod");

  const modProperty = createRef<Latex>();

  view.add(
    <Latex
      ref={modProperty}
      fill="white"
      tex={"(a + b) \\bmod n = [a \\bmod n + b \\bmod n] \\bmod n"}
      y={view.height() / 2 + 100}
    />,
  );

  yield* all(
    tex().opacity(0.5, 1),
    modProperty().position.y(view.height() / 2 - 100, 1),
  );

  yield* beginSlide("mod-distributive-property");

  yield* all(tex().filters.blur(10, 1));

  const proofLines = [
    "dr(a + b) = dr(dr(a) + dr(b))",
    "dr(a + b) = 1 + ([1 + (a - 1) \\bmod 9] + [1 + (b - 1) \\bmod 9] - 1) \\bmod 9",
    "dr(a + b) = 1 + [1 + (a - 1) \\bmod 9 + (b - 1) \\bmod 9] \\bmod 9",
    "dr(a + b) = 1 + [1 \\bmod 9 + (a - 1) \\bmod 9 + (b - 1) \\bmod 9] \\bmod 9",
    "dr(a + b) = 1 + (a + b - 1) \\bmod 9",
    "dr(a + b) = dr(a + b)",
  ];

  const proofTex = proofLines.map(() => createRef<Latex>());

  view.add(
    <>
      {proofLines.map((line, i) => (
        <Latex
          ref={proofTex[i]}
          fill="white"
          tex={line}
          opacity={0}
          y={(i - proofTex.length / 2) * 100}
        />
      ))}
    </>,
  );

  yield* sequence(0.1, ...proofTex.map((t) => t().opacity(1, 1)));

  yield* beginSlide("dr-sum-property");

  yield* sequence(
    0.75,
    sequence(0.1, ...proofTex.map((t) => t().opacity(0, 1))),
    all(
      tex().tex(["dr(1234) = dr(", "1", "2", "3", "4", ")"], 1),
      tex().filters.blur(0, 1),
      tex().opacity(1, 1),
    ),
    modProperty().y(view.height() + 200, 1),
  );

  modProperty().opacity(0);

  yield* waitFor(0.5);

  yield* chain(
    tex().tex(["dr(1234) = dr(", "1", "2", "00", " + ", "3", "4", ")"], 1),
    tex().tex(
      [
        "dr(1234) = dr(",
        "dr(",
        "1",
        "2",
        "00",
        ") + ",
        "dr(",
        "3",
        "4",
        ")",
        ")",
      ],
      1,
    ),
    tex().tex(
      ["dr(1234) = dr(", "dr(", "1", "2", ") + ", "dr(", "3", "4", ")", ")"],
      1,
    ),
  );

  yield* beginSlide("dr-split-on-tens");

  yield* chain(
    tex().tex(["dr(1234) = ", "dr(", "1", "2", "3", "4", ")"], 1),
    tex().tex(["dr(1234) = ", "dr(", "1", "+", "2", "3", "4", ")"], 1),
    tex().tex(
      ["dr(1234) = ", "dr(", "1", "+", "dr(", "2", "+", "3", "4", ")", ")"],
      1,
    ),
    tex().tex(
      [
        "dr(1234) = ",
        "dr(",
        "1",
        "+",
        "dr(",
        "2",
        "+",
        "dr(",
        "3",
        "+",
        "4",
        ")",
        ")",
        ")",
      ],
      1,
    ),
    tex().tex(
      [
        "dr(1234) = ",
        "dr(",
        "1",
        "+",
        "dr(",
        "2",
        "+",
        "dr(",
        "3",
        "+",
        "dr(",
        "4",
        ")",
        ")",
        ")",
        ")",
      ],
      1,
    ),
    tex().scale(1.5, 1),
  );

  yield* beginSlide("dr-split-by-digit");

  yield* tex().opacity(0, 0.5);

  const code = createRef<Code>();

  const smallRootTableBody = Code.createSignal("\n  // ...");
  const smallRootTableType = Code.createSignal("SmallDigitalRootTable");

  view.add(
    <Code
      ref={code}
      opacity={0}
      fontSize={50}
      code={CODE`\
type ${smallRootTableType} = [${smallRootTableBody}
]`}
    />,
  );

  yield* code().opacity(1, 0.5);
  yield* beginSlide("small-digital-root-table");

  const smallRootTableCells = range(19).map(() => {
    const value = createSignal(0);
    const code = Code.createSignal(() => Math.floor(value()).toString());
    return { value, code };
  });

  const smallRootTypeName = Code.createSignal("SmallDigitalRoot<...>");
  const smallRootTypeBody = Code.createSignal("...");

  yield* chain(
    smallRootTableBody(
      CODE`\n  ${[
        ...joinIter(
          smallRootTableCells.map((c) => c.code),
          ", ",
        ),
      ]}`,
      0.75,
    ),
    sequence(
      0.05,
      ...smallRootTableCells.map(({ value }, x) => value(digitalRoot(x), 0.8)),
    ),
    code().code.append(
      CODE`\n\ntype ${smallRootTypeName} = ${smallRootTypeBody}`,
      1,
    ),
    smallRootTypeName.edit(
      1,
    )`SmallDigitalRoot<${replace("...", "N extends number")}>`,
    smallRootTypeBody(CODE`\n  ${smallRootTableType}[N] extends number`, 1),
    smallRootTypeBody.append(
      CODE`\n    ? ${smallRootTableType}[N]\n    : never`,
      1,
    ),
  );

  yield* beginSlide("small-digital-root-ts");

  yield* code().selection(code().findAllRanges(/(\?|:).*/gi), 1);

  yield* beginSlide("never-case-highlight");

  yield* code().selection(DEFAULT, 1);
});
