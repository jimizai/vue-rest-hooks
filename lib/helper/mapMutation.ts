import { computed } from "@vue/composition-api";
import {
  normalizeNamespace,
  IsArrayOrObject,
  isValidMap,
  normalizeMap,
  getModuleByNamespace
} from "../utils";
import { Store } from "vuex";

export const mapMutationsConvert = (store: Store<any>) =>
  normalizeNamespace(
    (
      store: Store<any>,
      namespace: IsArrayOrObject | string,
      mutations: IsArrayOrObject
    ) => {
      const res: Record<string, any> = {};
      if (process.env.NODE_ENV !== "production" && !isValidMap(mutations)) {
        console.error(
          "[vuex] mapMutations: mapper parameter must be either an Array or an Object"
        );
      }
      normalizeMap(mutations).forEach(({ key, val }) => {
        res[key] = function mappedMutation(...args: any[]) {
          // Get the commit method from store
          let commit = store.commit;
          if (namespace) {
            const module = getModuleByNamespace(
              store,
              "mapMutations",
              namespace as any
            );
            if (!module) {
              return;
            }
            commit = module.context.commit;
          }
          return commit.apply(store, [val].concat(args) as any);
        };
      });
      return res;
    },
    store
  );
