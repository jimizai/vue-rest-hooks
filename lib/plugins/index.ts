import { PluginObject, VueConstructor } from "vue";
import VueRouter, { Route } from "vue-router";
import { Store } from "vuex";
import { Vue } from "vue/types/vue";
import { convertStore } from "../helper";
import { useValidator } from "../helper/useValidator";
import {
  NormalizeNamespaceReturn,
  typeActionsAndMutationsReturn
} from "../utils";

let curVue: VueConstructor | null = null;
const DEFAULT_EXTRA_KEYS = ["route", "router"];

export interface PluginOptions {
  extraKeys?: string[];
}

interface WrappedRoute extends Route {
  useValidator: (params: string[], fn: () => void) => void;
}

declare module "@vue/composition-api" {
  interface SetupContext {
    route: WrappedRoute;
    router: VueRouter;
    store: Store<any>;
    refs: any;
    vuex: {
      mapState: NormalizeNamespaceReturn;
      mapGetters: NormalizeNamespaceReturn;
      mapMutations: typeActionsAndMutationsReturn;
      mapActions: typeActionsAndMutationsReturn;
    };
  }
}

export const WrappedSetupPlugin: PluginObject<PluginOptions> = {
  install(Vue, options = {}) {
    if (curVue) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("Vue function api helper init duplicated !");
      }
    }
    const pureVueProtoKeys = Object.keys(Vue.prototype);
    const pureVm = Object.keys(new Vue());

    const extraKeys = (options.extraKeys || []).concat(DEFAULT_EXTRA_KEYS);

    function wrapperSetup(this: Vue) {
      let vm = this;
      let $options = vm.$options;
      let setup = $options.setup;
      if (!setup) {
        return;
      }
      if (typeof setup !== "function") {
        // eslint-disable-next-line no-console
        console.warn(
          'The "setup" option should be a function that returns a object in component definitions.',
          vm
        );
        return;
      }
      // wapper the setup option, so that we can use prototype properties and mixin properties in context
      $options.setup = function wrappedSetup(props, ctx: any) {
        // to extend context
        Object.keys(vm)
          .filter(x => /^\$/.test(x) && pureVm.indexOf(x) === -1)
          .forEach(x => {
            // @ts-ignore
            ctx[x.replace(/^\$/, "")] = vm[x];
          });
        Object.keys(vm.$root.constructor.prototype)
          .filter(x => /^\$/.test(x) && pureVueProtoKeys.indexOf(x) === -1)
          .forEach(x => {
            // @ts-ignore
            ctx[x.replace(/^\$/, "")] = vm[x];
          });
        // to extend context with router properties
        extraKeys.forEach(key => {
          // @ts-ignore
          let value = vm["$" + key];
          if (value) {
            (ctx as any)[key] = value;
          }
        });
        ctx.vuex = convertStore(ctx.store);
        ctx.route.useValidator = (params: string[], fn: () => void) =>
          useValidator(params, fn, ctx.route.query);
        // @ts-ignore
        return setup(props, ctx);
      };
    }

    Vue.mixin({
      beforeCreate: wrapperSetup
    });
  }
};
