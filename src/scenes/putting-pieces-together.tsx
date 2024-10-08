import { Code, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  beginSlide,
  chain,
  createRef,
  Direction,
  slideTransition,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} fill="white" fontSize={100}>
      Складываем пазл
    </Txt>,
  );

  yield* chain(
    slideTransition(Direction.Bottom, 2),
    beginSlide("chapter-title"),
    title().opacity(0, 0.5),
  );

  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      opacity={0}
      code={`\
type DigitalRoot<N extends number> =
  DigitalRootImpl<Digits<N>>

type Solution<T extends number> =
  DigitalRoot<T>
`}
    />,
  );

  yield* chain(code().opacity(1, 0.5), beginSlide("final-code"));
});
