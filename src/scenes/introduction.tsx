import {
  makeScene2D,
  Txt,
  Code,
  CODE,
  Node,
  remove,
  insert,
  replace,
} from "@motion-canvas/2d";
import {
  beginSlide,
  createRef,
  waitFor,
  createSignal,
  all,
} from "@motion-canvas/core";
import { digitalRoot } from "../lib";
import { Cross, DigitalRootDemo } from "../components";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(<Txt ref={title} fontSize={100} fill="white" text="" />);

  yield* title().text("Цифровой корень на TypeScript", 1);
  yield* beginSlide("presentation-title");

  yield* title().text("Введение", 1);
  yield* beginSlide("chapter-title");
  yield* title().opacity(0, 0.5);

  const backgroundGroup = createRef<Node>();
  const rootExamples = createRef<Code>();

  view.add(
    <Node ref={backgroundGroup}>
      <Code ref={rootExamples} fontSize={48} />
    </Node>,
  );

  yield* rootExamples().code.append(
    "function digitalRoot(n: number): number",
    1,
  );
  yield* beginSlide("function-def");

  yield* rootExamples().code.append("\n\n// examples:\n", 1);

  const rootArguments = [4, 14, 123].map((x) => createSignal(x));

  for (const rootArg of rootArguments) {
    const rootArgCode = Code.createSignal(() =>
      Math.floor(rootArg()).toString(),
    );

    const rootResultCode = Code.createSignal(() =>
      digitalRoot(parseInt(rootArg().toString())).toString(),
    );

    yield* rootExamples().code.append(
      CODE`\ndigitalRoot(${rootArgCode}) == ${rootResultCode}`,
      0.5,
    );
  }

  yield* beginSlide("simple-examples");

  yield* all(
    rootArguments[0](19, 0.5),
    rootArguments[1](57, 0.5),
    rootArguments[2](99, 0.5),
  );

  yield* beginSlide("rec-examples");

  const rootDemo = createRef<DigitalRootDemo>();

  view.add(
    <DigitalRootDemo
      ref={rootDemo}
      value={123456789}
      latex={{ fontSize: 80, fill: "white" }}
      opacity={0}
    />,
  );

  yield* backgroundGroup().filters.blur(15, 1);
  yield* rootDemo().opacity(1, 0.5);

  yield* beginSlide("sum-demo");

  while (rootDemo().digits().length > 1) {
    yield* rootDemo().performSum({
      spreadDuration: 1,
      sumDelay: 0.5,
      sumDuration: 0.5,
    });

    yield* waitFor(0.25);
  }

  yield* rootDemo().showResult({
    mapTex: (i, r) => `{{dr}}(${i}) = {{${r}}}`,
    duration: 1,
  });

  yield* beginSlide("sum-demo-end");

  const formalDefTex = rootDemo().latex;

  yield* formalDefTex().tex(
    [
      "{{dr}}(n) = \\begin{cases}n, 0 \\le n \\le 9\\\\dr(ds(n)), n \\gt 9\\end{cases}",
    ],
    1,
  );

  yield* beginSlide("function-formal-def");

  yield* all(
    formalDefTex().opacity(0, 0.5),
    backgroundGroup().filters.blur(0, 1),
  );

  yield* waitFor(0.25);

  const cross = createRef<Cross>();

  view.add(
    <Cross
      ref={cross}
      extends={[600, 400]}
      start={0}
      end={0}
      curve={{ stroke: "white", lineWidth: 12 }}
    />,
  );

  yield* cross().end(1, 1);
  yield* cross().start(1, 1);

  yield* rootExamples().code("function digitalRoot(n: number): number", 1);

  yield* rootExamples().code.edit(
    1,
  )`${replace("function ", "type ")}${replace("d", "D")}igitalRoot${replace("(n:", "<N extends")} number${remove("): number")}${insert("> = ...")}`;

  yield* beginSlide("plot-twist");
});
