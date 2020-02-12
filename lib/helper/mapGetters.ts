import { computed } from "@vue/composition-api";
import {
  normalizeNamespace,
  IsArrayOrObject,
  isValidMap,
  normalizeMap,
  getModuleByNamespace
} from "../utils";
import { Store } from "vuex";

export const mapGettersConvert = <T = any>(store: Store<T>) =>
  normalizeNamespace<T>(
    (
      store: Store<any>,
      namespace: IsArrayOrObject | string,
      getters: IsArrayOrObject
    ) => {
      const res: Record<string, any> = {};
      if (process.env.NODE_ENV !== "production" && !isValidMap(getters)) {
        console.error(
          "[vuex] mapGetters: mapper parameter must be either an Array or an Object"
        );
      }

      normalizeMap(getters).forEach(({ key, val }) => {
        // The namespace has been mutated by normalizeNamespace
        val = namespace + val;
        res[key] = (function mappedGetter() {
          if (
            namespace &&
            !getModuleByNamespace(store, "mapGetters", namespace as any)
          ) {
            return;
          }
          if (
            process.env.NODE_ENV !== "production" &&
            !(val in store.getters)
          ) {
            console.error(`[vuex] unknown getter: ${val}`);
            return;
          }
          return computed(() => store.getters[val]);
        })();
      });
      return res;
    },
    store
  );
