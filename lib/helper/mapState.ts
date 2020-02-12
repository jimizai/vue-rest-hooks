import { computed } from "@vue/composition-api";
import {
  normalizeNamespace,
  IsArrayOrObject,
  isValidMap,
  normalizeMap,
  getModuleByNamespace
} from "../utils";
import { Store } from "vuex";

export const mapStateConvert = <T = any>(store: Store<T>) =>
  normalizeNamespace<T>(
    (
      store: Store<any>,
      namespace: IsArrayOrObject | string,
      states: IsArrayOrObject
    ) => {
      const res: Record<string, any> = {};
      if (process.env.NODE_ENV !== "production" && !isValidMap(states)) {
        console.error(
          "[vuex] mapState: mapper parameter must be either an Array or an Object"
        );
      }

      normalizeMap(states).forEach(({ key }) => {
        let state = store.state;
        if (namespace) {
          const module = getModuleByNamespace(
            store,
            "mapState",
            namespace as any
          );
          if (!module) {
            return;
          }
          state = module.context.state;
        }
        res[key] = computed(() => state[key]);
      });

      return res;
    },
    store
  );
