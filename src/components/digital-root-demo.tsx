import {
  initial,
  Latex,
  LatexProps,
  NodeProps,
  Node,
  signal,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInCubic,
  SignalValue,
  SimpleSignal,
  SmoothSpring,
  Spring,
  waitFor,
  spring,
} from "@motion-canvas/core";

export type DigitalRootDemoProps = NodeProps & {
  value: SignalValue<number>;
  latex?: LatexProps;
};

export class DigitalRootDemo extends Node {
  @initial(0)
  @signal()
  public declare readonly value: SimpleSignal<number, this>;

  public readonly latex = createRef<Latex>();

  readonly #initialValue: number;

  public constructor({
    latex: latexProps = {},
    ...props
  }: DigitalRootDemoProps) {
    super({ ...props });

    this.#initialValue = this.value();

    this.add(
      <Latex
        {...latexProps}
        ref={this.latex}
        tex={this.#initialValue.toString()}
      />,
    );
  }

  public readonly digits = createSignal(() => {
    return [...String(this.value())].map(Number);
  });

  public *performSum({
    spreadDuration = 1,
    sumDelay = 0.5,
    sumDuration = 1,
    spring: scaleSpring = SmoothSpring,
  }: {
    spreadDuration?: number;
    sumDelay?: number;
    sumDuration?: number;
    spring?: Spring;
  }) {
    yield* this.updateTex();
    yield* this.updateTex({
      digitSeparator: " + ",
      duration: spreadDuration,
    });

    yield* waitFor(sumDelay);

    yield* this.scale(0, sumDuration, easeInCubic);
    this.value(this.digits().reduce((a, b) => a + b));
    yield* this.updateTex();

    yield* spring(scaleSpring, 0, 1, 0.01, (v) => this.scale(v));
  }

  public *showResult({
    mapTex,
    duration = 1,
  }: {
    mapTex: (initial: number, result: number) => string | string[];
    duration?: number;
  }) {
    yield* this.latex().tex(mapTex(this.#initialValue, this.value()), duration);
  }

  private *updateTex({
    digitSeparator = "",
    duration = 0,
  }: {
    digitSeparator?: string;
    duration?: number;
  } = {}) {
    yield* this.latex().tex(
      this.digits()
        .map((d) => `{{${d}}}`)
        .join(digitSeparator),
      duration,
    );
  }
}
