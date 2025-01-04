export const is = {
  arr: Array.isArray,
  bol: (a: unknown): a is boolean => typeof a === "boolean",
  str: (a: unknown): a is string => typeof a === "string",
  num: (a: unknown): a is number => typeof a === "number",
  fun: (a: unknown): a is Function => typeof a === "function",
  und: (a: unknown): a is undefined => typeof a === "undefined",
  nul: (a: unknown): a is null => a === null,
  obj: (a: unknown): a is object => !!a && a.constructor.name === "Object",
  set: (a: unknown): a is Set<unknown> => a instanceof Set,
  map: (a: unknown): a is Map<unknown, unknown> => a instanceof Map,
};

type EachFn<Value, Key, This> = (this: This, value: Value, key: Key) => void;
type Eachable<Value = any, Key = any, This = any> = {
  forEach(cb: EachFn<Value, Key, This>, ctx?: This): void;
};

export const each = <Value, Key, This>(
  obj: Eachable<Value, Key, This>,
  fn: EachFn<Value, Key, This>
) => obj.forEach(fn);
