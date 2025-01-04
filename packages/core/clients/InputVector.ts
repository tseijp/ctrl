import e from "../helpers/node";
import { is } from "../helpers/utils";
import { InputValue } from "./InputValue";

interface Props {
  x: number;
  y?: number;
  z?: number;
  _x?: (x: number) => void;
  _y?: (y: number) => void;
  _z?: (z: number) => void;
  key: string;
}

export default function InputVector(props: Props) {
  const { x, y, z, _x, _y, _z, key } = props;
  return e(
    "div",
    null,
    e("div", { className: "text-[10px] leading-[14px] mt-1" }, key),
    e(
      "div",
      { className: "grid gap-x-2 grid-cols-[88px_88px_24px]" },
      is.num(x) ? InputValue({ icon: "X", value: x, set: _x }) : null,
      is.num(y) ? InputValue({ icon: "Y", value: y, set: _y }) : null,
      is.num(z) ? InputValue({ icon: "Z", value: z, set: _z }) : null
    )
  );
}
