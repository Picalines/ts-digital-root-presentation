import { CODE, Code, makeScene2D, replace, Txt, Node } from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  chain,
  createRef,
  DEFAULT,
  Direction,
  sequence,
  slideTransition,
} from "@motion-canvas/core";
import { Cross } from "../components";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} fill="white" fontSize={100}>
      Подскажите, я плохо вижу!
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 2);
  yield* beginSlide("chapter-title");

  yield* title().opacity(0, 0.5);

  const bgGroup = createRef<Node>();
  const code = createRef<Code>();
  const errorCross = createRef<Cross>();

  view.add(
    <Node ref={bgGroup}>
      <Code ref={code} />
      <Cross
        ref={errorCross}
        end={0}
        opacity={0.5}
        curve={{ stroke: "red", lineWidth: 6 }}
      />
    </Node>,
  );

  const rootImplTypeName = Code.createSignal("DigitalRoot");
  const rootImplTypeParams = Code.createSignal("N extends number");
  const rootImplTypeBody = Code.createSignal("...");

  yield* chain(
    code().code.append(
      CODE`type ${rootImplTypeName}<${rootImplTypeParams}> = ${rootImplTypeBody}`,
      1,
    ),
    beginSlide("naive-digital-root-signature"),
    rootImplTypeBody(CODE`\n  ${rootImplTypeName}</* Digit[] */>`, 1),
  );

  const recErrorBox = code().getSelectionBBox(
    code().findFirstRange(/\/\*.*?\*\//gi),
  )[0];

  errorCross().position(recErrorBox.center);
  errorCross().extends(recErrorBox.size.mul(0.6));

  yield* sequence(0.25, errorCross().end(1, 1), errorCross().start(1, 1));

  yield* beginSlide("recursion-error-with-number");

  yield* chain(
    all(
      rootImplTypeName.append("Impl", 1),
      rootImplTypeParams.edit(
        1,
      )`${replace("N", "DS")} extends ${replace("number", "Digit[]")}`,
    ),
    rootImplTypeBody("\n  ...", 1),
  );

  yield* beginSlide("ts-digital-root-signature");

  yield* rootImplTypeBody(
    `\

  DS extends [Digit]
    ? DS[0]
    : ...`,
    1,
  );

  yield* beginSlide("digital-root-base-case");

  const tcode = createRef<Code>();

  view.add(<Code ref={tcode} fontSize={60} />);

  yield* sequence(
    0.1,
    all(bgGroup().filters.blur(10, 1), bgGroup().opacity(0.5, 1)),
    tcode().code("infer", 1),
  );

  yield* beginSlide("ts-infer");

  yield* tcode().code(
    `\
type Screen = {
  width: number
  height: number
  device: {
    model: string
    ...
  }
}`,
    1,
  );

  yield* beginSlide("ts-types-are-nested");

  yield* chain(
    ...tcode()
      .findAllRanges(/\w+\n/gi)
      .map((range) => tcode().selection(range, 0.5)),
    tcode().selection(DEFAULT, 0.5),
  );

  yield* beginSlide("ts-type-inner-parts");

  yield* chain(
    tcode().code("", 0.5),
    tcode().fontSize(50, 0),
    tcode().code(
      `\
export const ShinyButton: FC<{
  sparkle: number,
}> = ({ sparkle }) => {
  ...
}

// other module

type ShinyButtonProps = ...`,
      0.5,
    ),
  );

  yield* beginSlide("react-component-example");

  yield* chain(
    tcode().code("", 0.5),
    tcode().code(
      `\
type InnerPart<T> = T extends {
  some: { shape: infer I }
}
  ? { newShape: T } : never

type Example = InnerPart<{
  some: { shape: 'It works!' }
}>`,
      1,
    ),
  );

  tcode().selection(DEFAULT);

  yield* beginSlide("basic-infer-example");

  yield* tcode().selection(tcode().findAllRanges(/\bT\b/g)[1], 0.5);
  yield* beginSlide("highlight-extends-left");

  yield* tcode().selection(tcode().findFirstRange(/extends \{\n.*\n\}/g), 0.5);
  yield* beginSlide("highlight-extends-right");

  yield* tcode().selection(
    tcode().findFirstRange(/\? \{ newShape: .*? \}/g),
    0.5,
  );
  yield* beginSlide("highlight-true-branch");

  yield* tcode().selection(tcode().findFirstRange(/: never/g), 0.5);
  yield* beginSlide("highlight-true-branch");

  yield* chain(
    tcode().selection(DEFAULT, 0.5),
    tcode().code("", 0.5),
    tcode().code(
      `\
type ComponentProps<C> = C extends
  (props: infer P) => ReactNode
    ? P
    : never`,
      1,
    ),
  );

  yield* beginSlide("component-props-def");

  yield* chain(
    tcode().code.append(
      `\


type ShinyButtonProps =
  ComponentProps<typeof ShinyButton>`,
      1,
    ),
    tcode().code.append(
      `\

// { sparkle: number }`,
      1,
    ),
  );

  yield* beginSlide("shiny-button-props");

  yield* chain(
    tcode().code("", 0.5),
    tcode().code.append(
      `\
Operation[] operations = [/* ... */]`,
      1,
    ),
    beginSlide("csharp-example-value-to-match"),
    tcode().fontSize(35, 1),
    tcode().code.append(
      `\


// Императивно:
if (operations.Length == 1 && operations[0] is DeleteOperation) {
	var deleteOperation = (DeleteOperation)operations[0];
	if (deleteOperation.ItemCount > 0) {
		// ...
	}
}
`,
      1,
    ),
    beginSlide("csharp-example-imperative"),
    tcode().code.append(
      `\

// Декларативно:
if (operations is [DeleteOperation { ItemCount: > 0 }]) {
  // ...
}
`,
      1,
    ),
    beginSlide("csharp-example-declarative"),
  );

  yield* all(
    tcode().opacity(0, 1),
    bgGroup().opacity(1, 1),
    bgGroup().filters.blur(0, 1),
  );

  yield* chain(
    rootImplTypeBody.edit(1)`\

  DS extends ${replace("[Digit]", "[infer D1 extends Digit]")}
    ? ${replace("DS[0]", "D1")}
    : ...`,

    beginSlide("base-case-with-infer"),

    rootImplTypeBody.edit(1)`\

  DS extends [infer D1 extends Digit]
    ? D1
    : ${replace("...", "DS extends [")}`,

    rootImplTypeBody.append(
      `\

        infer D1 extends Digit,
        infer D2 extends Digit,
        ...infer Rest extends Digit[]
    ]
      ? ...
      : never`,
      1,
    ),
    beginSlide("recursive-case-with-infer"),
  );

  yield* chain(
    code().fontSize(40, 0.5),
    code().code.replace(
      code().findLastRange(/\.\.\./g),
      CODE`${rootImplTypeName}<[
          SmallDigitalRoot<AddDigits<D1, D2>>,
          ...Rest
        ]>`,
      1,
    ),
    beginSlide("infer-base-case"),
  );

  yield* chain(
    code().selection(code().findAllRanges(/infer D\d extends Digit,/g), 1),
    beginSlide("highlight-first-two-digits"),
  );

  yield* chain(
    code().selection(code().findFirstRange(/\.\.\.infer .*? Digit\[\]/g), 1),
    beginSlide("highlight-rest-digits"),
  );

  yield* chain(
    code().selection(DEFAULT, 0.5),
    beginSlide("digital-root-impl-done"),
  );

  yield* chain(
    code().code(
      `\
type Digits<N extends number> =
  N extends Digit
    ? [N]
    : ...`,
      1,
    ),
    beginSlide("reading-digits-base-case"),
  );

  yield* code().code.replace(
    code().findLastRange(/\.\.\./g),
    `\
\`\${N}\` extends \`\${infer D1 extends Digit}\${infer R extends number}\`
      ? [D1, ...Digits<R>]
      : never`,
    1,
  );

  yield* beginSlide("recursive-digit-reading");

  yield* code().selection(code().findFirstRange(/`\$\{.*`/g), 1);

  yield* beginSlide("highlight-string-infer");

  yield* all(
    code().selection(DEFAULT, 1),
    code().code.append(
      `\


type X = Digits<12345> // [1, 2, 3, 4, 5]`,
      1,
    ),
  );

  yield* beginSlide("reading-digits");
});
