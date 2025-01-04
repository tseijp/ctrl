import { is } from "./utils";

export type Merge<T extends object> = Partial<{
  [K in keyof T]: T[K] extends object ? Merge<T[K]> : T[K];
}>;

export function merge<T extends object>(a: Merge<T>, b: Merge<T>) {
  for (const key in b) {
    if (is.obj(a[key]) && is.obj(b[key])) merge(a[key], b[key]);
    else a[key] = b[key];
  }
}

export function append<El extends Node>(el: El, child: string | Node | null) {
  if (is.str(child)) child = document.createTextNode(child);
  if (!is.nul(child)) el.appendChild(child);
}

export default function create<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: Merge<HTMLElementTagNameMap[K]> | null = null,
  ...children: (string | Node | null)[]
) {
  const el = document.createElement(tagName) as HTMLElementTagNameMap[K];
  if (props) merge(el, props);
  children.forEach((child) => append(el, child));
  return el;
}
