import {
  makeScene2D,
  Txt,
  Code,
  CODE,
  Node,
  CubicBezier,
} from "@motion-canvas/2d";
import {
  slideTransition,
  Direction,
  all,
  createRef,
  beginSlide,
  waitFor,
  sequence,
  range,
  DEFAULT,
  chain,
  easeOutCubic,
  easeInCubic,
  Vector2,
  createSignal,
  Reference,
} from "@motion-canvas/core";
import { Cross } from "../components";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  const origin = createRef<Node>();
  const code = createRef<Code>();
  const cross = createRef<Cross>();

  const centerNumber = 123;

  view.add(
    <Node ref={origin}>
      <Txt ref={title} fill="white" fontSize={100}>
        Арифметика в типах?
      </Txt>
      <Code ref={code} opacity={0} code={`type Sum = ${centerNumber} + 456`} />
      <Cross
        ref={cross}
        extends={[400, 100]}
        y={100}
        start={0}
        end={0}
        opacity={0.5}
        curve={{ stroke: "red", lineWidth: 6 }}
      />
    </Node>,
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* waitFor(0.5);

  yield* all(
    title().position.y(-100, 1),
    code().position.y(100, 1),
    code().opacity(1, 1),
  );

  yield* beginSlide("chapter-title");

  yield* sequence(
    0.5,
    origin().position.y(-100, 1),
    title().opacity(0.25, 1),
    sequence(0.25, cross().end(1, 1), cross().start(1, 1)),
  );

  yield* beginSlide("no-number-operators");

  yield* all(
    title().opacity(0, 0.5),
    code().code(centerNumber.toString(), 1),
    code().scale(1.5, 1),
  );

  origin().position(DEFAULT);
  code().position(DEFAULT);

  yield* waitFor(0.25);

  const numbers = symmetricRange(13).map((x) => ({
    value: centerNumber + x,
    pos: x,
    ref: createRef<Code>(),
    isAtEdge: false,
  }));

  numbers[0].isAtEdge = true;
  numbers[numbers.length - 1].isAtEdge = true;

  const numberSpacing = 150;

  yield* sequence(
    0.05,
    ...numbers.flatMap(({ value, pos: x, ref: number, isAtEdge }) => {
      if (value == centerNumber) {
        number(code());
        return [];
      }

      origin().add(
        <Code
          ref={number}
          code={isAtEdge ? "..." : value.toString()}
          x={x * numberSpacing}
          opacity={0}
          y={-30}
        />,
      );

      return [all(number().opacity(1, 0.5), number().y(0, 0.5))];
    }),
  );

  yield* waitFor(0.5);

  const baseType = createRef<Code>();

  origin().add(
    <Code ref={baseType} code="number" opacity={0} scale={1.5} y={-400} />,
  );

  const curves: Reference<CubicBezier>[] = [];

  yield* sequence(
    0.25,
    all(origin().scale(0.9, 1), origin().position.y(200, 1)),
    baseType().opacity(1, 1),

    sequence(
      0.03,
      ...numbers.map(({ ref: number }) => {
        const curve = createRef<CubicBezier>();
        curves.push(curve);

        const startPoint = createSignal(() => baseType().position().addY(50));
        const endPoint = createSignal(() => number().position().addY(-50));

        origin().add(
          <CubicBezier
            ref={curve}
            stroke="white"
            lineWidth={6}
            p0={() => startPoint()}
            p1={() => midpoint(startPoint(), endPoint()).addY(50)}
            p2={() => endPoint().addY(-150)}
            p3={() => endPoint()}
            end={0}
            opacity={0.5}
          />,
        );

        return chain(
          curve().end(1, 1, easeInCubic),
          number()
            .y(number().y() + 30, 0.5, easeOutCubic)
            .to(number().y(), 0.5, easeInCubic),
        );
      }),
    ),
  );

  yield* waitFor(0.5);

  yield* all(
    ...numbers.map(({ ref: number, pos: x }) => {
      return chain(
        number().x(number().x() - x * numberSpacing * 0.05, 0.5, easeOutCubic),
        number().x(number().x(), 0.5, easeInCubic),
      );
    }),
  );

  yield* beginSlide("number-literal-types");

  yield* all(
    origin().scale(1, 1),
    origin().position(0, 1),
    code().scale(1, 1),
    baseType().opacity(0, 1),
    ...numbers.map(({ value, ref: number }) =>
      number().opacity(value == centerNumber ? 1 : 0, 1),
    ),
    ...curves.map((curve) => all(curve().start(1, 1), curve().opacity(0, 1))),
  );

  const typeName = Code.createSignal("Sum");
  const typeBody = Code.createSignal("...");

  yield* code().code(CODE`type ${typeName} = ${typeBody}`, 1);

  yield* typeBody("... // extends, infer, :)", 1);

  yield* beginSlide("tech-teaser");

  yield* all(typeName("Digit", 1), typeBody(range(10).join(" | "), 1));

  yield* beginSlide("define-digit");

  yield* all(typeName("AddDigits<D1, D2>", 1), typeBody('"D1 + D2"', 1));

  yield* beginSlide("add-digits-signature");
});

function symmetricRange(oddLength: number) {
  const halfLen = Math.round(oddLength / 2);

  return [
    ...range(-halfLen).reverse().slice(0, -1),
    0,
    ...range(halfLen).slice(1),
  ];
}

function midpoint(v1: Vector2, v2: Vector2) {
  return v1.add(v2.sub(v1).scale(0.5));
}
