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
  fetchMore: (params: QueryParams<TParam, TData>) => void;
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
  params?: QueryParams<TParam, TData>
): QueryResult<TParam, TData> => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<any>(undefined);

  const refetch = (executeParams?: QueryParams<TParam, TData>) => {
    if (!executeParams) {
      executeParams = params;
    }
    execute(executeParams);
  };

  const fetchMore = (fetchMoreParams?: QueryParams<TParam, TData>) => {
    if (!fetchMoreParams) {
      fetchMoreParams = params;
    }
    execute(fetchMoreParams, true);
  };

  function execute(
    args?: QueryParams<TParam, TData>,
    fetchmore: boolean = false
  ) {
    loading.value = true;
    return request(args?.variables)
      .then(result => {
        args?.update?.(result);
        if (!fetchmore) {
          data.value = result;
        } else {
          data.value = { ...data.value, ...result };
        }
      })
      .catch(err => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  onMounted(() => execute(params));

  return {
    loading,
    error,
    data,
    refetch,
    fetchMore
  };
};
