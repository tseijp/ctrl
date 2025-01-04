import { dragEvent } from "../helpers/drag";
import e from "../helpers/node";

function getInputValue(e: Event) {
  if (e.target instanceof HTMLInputElement) return e.target.valueAsNumber;
  throw ``;
}

interface Props {
  icon?: string;
  value: number;
  set?: (x: number) => void;
}

export function InputValue(props: Props) {
  const { icon = "", value, set } = props;

  let span: HTMLSpanElement;
  let input: HTMLInputElement;

  const el = e(
    "label",
    { className: "relative" },
    (span = e(
      "span",
      { className: "w-6 h-6 absolute grid place-content-center select-none" },
      icon
    )),
    (input = e("input", {
      type: "number",
      className: "pl-6 h-6 w-full bg-[#383838] rounded-sm outline-none",
      valueAsNumber: value,
      onchange: set ? (e: Event) => set(getInputValue(e)) : null,
    }))
  );

  const init = input.valueAsNumber;
  const drag = dragEvent(() => {
    drag.event?.stopPropagation();
    if (drag.isDragStart) span.style.cursor = "ew-resize";
    if (drag.isDragEnd) span.style.cursor = "";
    if (drag.isDragging) {
      const { offset } = drag;
      const x = init + offset[0];
      input.valueAsNumber = x << 0;
      if (set) set(x);
    }
  });

  drag.offset[0] = init;
  drag.onMount(span);

  return el;
}
