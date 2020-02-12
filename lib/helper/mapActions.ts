import {
  normalizeNamespace,
  IsArrayOrObject,
  isValidMap,
  normalizeMap,
  getModuleByNamespace
} from "../utils";
import { Store } from "vuex";

export const mapActionsConvert = (store: Store<any>) =>
  normalizeNamespace(
    (
      store: Store<any>,
      namespace: IsArrayOrObject | string,
      actions: IsArrayOrObject
    ) => {
      const res: Record<string, any> = {};
      if (process.env.NODE_ENV !== "production" && !isValidMap(actions)) {
        console.error(
          "[vuex] mapActions: mapper parameter must be either an Array or an Object"
        );
      }
      normalizeMap(actions).forEach(({ key, val }) => {
        res[key] = function mappedAction(...args: any[]) {
          // get dispatch function from store
          let dispatch = store.dispatch;
          if (namespace) {
            const module = getModuleByNamespace(
              store,
              "mapActions",
              namespace as any
            );
            if (!module) {
              return;
            }
            dispatch = module.context.dispatch;
          }
          return dispatch.apply(store, [val].concat(args) as any);
        };
      });
      return res;
    },
    store
  );
