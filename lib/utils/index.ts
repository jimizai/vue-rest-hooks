import { isObject } from "./shared";
import { Store } from "vuex";
import { Ref } from "@vue/composition-api";
export * from "./shared";

export type IsArrayOrObject = Record<string, any> | any[];
export type NormalizeNamespaceReturn = (
  namespace: string | IsArrayOrObject,
  map?: IsArrayOrObject
) => Record<string, Ref<any>>;

export type typeActionsAndMutationsReturn = (
  namespace: string | IsArrayOrObject,
  map?: IsArrayOrObject
) => Record<string, Function>;

export function normalizeMap(map: IsArrayOrObject): { key: any; val: any }[] {
  if (!isValidMap(map)) {
    return [];
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }));
}

export function isValidMap(map: unknown): boolean {
  return Array.isArray(map) || isObject(map);
}

export function normalizeNamespace<T>(fn: Function, store: Store<T>) {
  return (namespace: string | IsArrayOrObject, map?: IsArrayOrObject) => {
    if (typeof namespace !== "string") {
      map = namespace;
      namespace = "";
    } else if (namespace.charAt(namespace.length - 1) !== "/") {
      namespace += "/";
    }
    return fn(store, namespace, map);
  };
}

export function getModuleByNamespace(
  store: any,
  helper: string,
  namespace: string
) {
  const module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== "production" && !module) {
    console.error(
      `[vuex] module namespace not found in ${helper}(): ${namespace}`
    );
  }
  return module;
}
