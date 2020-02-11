import { ref, onMounted, Ref } from "@vue/composition-api";

export interface QueryParams<TParam> {
  variables: TParam;
}

export interface QueryResult<TParam, TData> {
  loading: Ref<boolean>;
  data: Ref<TData>;
  error: Ref<any>;
  refetch: (params: QueryParams<TParam>) => void;
  fetchMore: (params: QueryParams<TParam>) => void;
}

export const useQuery = <TParam = Record<string, any>, TData = any>(
  request: (params?: TParam) => Promise<TData>,
  params?: QueryParams<TParam>
): QueryResult<TParam, TData> => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<any>(undefined);

  const refetch = (executeParams?: QueryParams<TParam>) => {
    if (executeParams && !Object.keys(executeParams?.variables)) {
      executeParams = params;
    }
    execute(executeParams);
  };

  const fetchMore = (fetchMoreParams?: QueryParams<TParam>) => {
    if (fetchMoreParams && !Object.keys(fetchMoreParams?.variables)) {
      fetchMoreParams = params;
    }
    execute(fetchMoreParams, true);
  };

  function execute(args?: QueryParams<TParam>, fetchmore: boolean = false) {
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
