import { mapStateConvert } from "./mapState";
import { mapGettersConvert } from "./mapGetters";
import { mapMutationsConvert } from "./mapMutation";
import { mapActionsConvert } from "./mapActions";
import { Store } from "vuex";

export function convertStore(store: Store<any>) {
  return {
    mapState: mapStateConvert(store),
    mapGetters: mapGettersConvert(store),
    mapMutations: mapMutationsConvert(store),
    mapActions: mapActionsConvert(store)
  };
}
