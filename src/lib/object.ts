/**
 * Assign an own, enumerable property. Unlike `obj[key] = value`, this also works for the key
 * "__proto__" (plain assignment would change the object's prototype and silently drop the key).
 */
export function setOwn<T extends object>(obj: T, key: string, value: unknown): T {
  Object.defineProperty(obj, key, { value, enumerable: true, writable: true, configurable: true });
  return obj;
}
