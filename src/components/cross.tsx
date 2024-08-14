import {
  initial,
  NodeProps,
  Node,
  signal,
  CubicBezier,
  CubicBezierProps,
} from "@motion-canvas/2d";
import {
  createRef,
  SignalValue,
  SimpleSignal,
  PossibleVector2,
  Vector2,
  Vector2Signal,
} from "@motion-canvas/core";

export type CrossProps = NodeProps & {
  start?: SignalValue<number>;
  end?: SignalValue<number>;
  extends?: SignalValue<PossibleVector2<number>>;
  curve?: CubicBezierProps;
};

export class Cross extends Node {
  @signal()
  @initial(0)
  public declare readonly start: SimpleSignal<number, this>;

  @signal()
  @initial(1)
  public declare readonly end: SimpleSignal<number, this>;

  @signal()
  @initial(100)
  public declare readonly extends: Vector2Signal;

  readonly #curve1 = createRef<CubicBezier>();
  readonly #curve2 = createRef<CubicBezier>();

  constructor({
    extends: extendsProp,
    curve: curveProps = {},
    ...props
  }: CrossProps) {
    super({ ...props });

    this.extends = Vector2.createSignal(extendsProp);

    this.add(
      <CubicBezier
        {...curveProps}
        ref={this.#curve1}
        p0={() => this.extends().scale(-1)}
        p3={() => this.extends()}
        start={() => this.start()}
        end={() => this.end()}
      />,
    );

    this.add(
      <CubicBezier
        {...curveProps}
        ref={this.#curve2}
        p0={() => this.extends().mul([-1, 1]).scale(-1)}
        p3={() => this.extends().mul([-1, 1])}
        start={() => this.start()}
        end={() => this.end()}
      />,
    );
  }
}
