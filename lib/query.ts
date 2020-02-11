import { ref, onMounted, Ref } from "@vue/composition-api";

export interface Params<TParam> {
  variables: TParam;
}

export interface QueryResult<TParam, TData> {
  loading: Ref<boolean>;
  data: Ref<TData>;
  error: Ref<any>;
  refetch: (params: Params<TParam>) => void;
  fetchMore: (params: Params<TParam>) => void;
}

export const useQuery = <TParam extends Record<string, any>, TData extends any>(
  request: (params?: TParam) => Promise<TData>,
  params?: Params<TParam>
): QueryResult<TParam, TData> => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<TData>(undefined);

  const refetch = (executeParams?: Params<TParam>) => {
    if (!Object.keys(executeParams?.variables)) {
      executeParams = params;
    }
    execute(executeParams);
  };

  const fetchMore = (fetchMoreParams?: Params<TParam>) => {
    if (!Object.keys(fetchMoreParams?.variables)) {
      fetchMoreParams = params;
    }
    execute(fetchMoreParams, true);
  };

  function execute(args: Params<TParam>, fetchmore: boolean = false) {
    loading.value = true;
    return request(args?.variables)
      .then(result => {
        if (!fetchmore) {
          data.value = result;
        } else {
          data.value = { ...data.value, ...result };
        }
      })
      .then(err => {
        error.value = err;
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
