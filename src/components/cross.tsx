import {
  initial,
  NodeProps,
  Node,
  signal,
  Line,
  vector2Signal,
  LineProps,
} from "@motion-canvas/2d";
import {
  createRef,
  SignalValue,
  SimpleSignal,
  PossibleVector2,
  Vector2Signal,
} from "@motion-canvas/core";

export type CrossProps = NodeProps & {
  start?: SignalValue<number>;
  end?: SignalValue<number>;
  extends?: SignalValue<PossibleVector2<number>>;
  curve?: LineProps;
};

export class Cross extends Node {
  @initial(0)
  @signal()
  public declare readonly start: SimpleSignal<number, this>;

  @initial(1)
  @signal()
  public declare readonly end: SimpleSignal<number, this>;

  @initial(100)
  @vector2Signal()
  public declare readonly extends: Vector2Signal<this>;

  readonly #curve1 = createRef<Line>();
  readonly #curve2 = createRef<Line>();

  constructor({ curve: curveProps = {}, ...props }: CrossProps) {
    super({ ...props });

    this.add(
      <Line
        {...curveProps}
        ref={this.#curve1}
        points={() => [this.extends().scale(-1), this.extends()]}
        start={() => this.start()}
        end={() => this.end()}
      />,
    );

    this.add(
      <Line
        {...curveProps}
        ref={this.#curve2}
        points={() => [
          this.extends().mul([-1, 1]).scale(-1),
          this.extends().mul([-1, 1]),
        ]}
        start={() => this.start()}
        end={() => this.end()}
      />,
    );
  }
}
