import { ref, onMounted, Ref } from "@vue/composition-api";
import { RequestType } from "./type";

export interface QueryParams<TParam, TData> {
  variables?: TParam;
  update?: (result: TData) => void;
}

export interface QueryResult<TParam, TData> {
  loading: Ref<boolean>;
  data: Ref<TData>;
  error: Ref<any>;
  refetch: (params: QueryParams<TParam, TData>) => void;
}

interface Options {
  lazy?: boolean;
}

export /**
 * use restfull api typeof get reactive
 *
 * @template TParam
 * @template TData
 * @param {(params?: TParam) => Promise<TData>} request
 * @param {QueryParams<TParam>} [params]
 * @returns {QueryResult<TParam, TData>}
 */
const useQuery = <TParam = Record<string, any>, TData = any>(
  request: RequestType<TParam, TData>,
  params?: QueryParams<TParam, TData>,
  options: Options = {}
): QueryResult<TParam, TData> => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<any>(undefined);

  const refetch = (executeParams?: QueryParams<TParam, TData>) => {
    execute(executeParams);
  };

  function execute(args?: QueryParams<TParam, TData>) {
    loading.value = true;
    return request(args?.variables || params?.variables)
      .then((result: any) => {
        const update = args?.update || params?.update;
        update?.(result);
        data.value = result;
      })
      .catch((err: any) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  onMounted(() => {
    if (options.lazy) return;
    execute(params);
  });

  return {
    loading,
    error,
    data,
    refetch
  };
};
