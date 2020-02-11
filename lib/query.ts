import { ref, onMounted, Ref } from "@vue/composition-api";

export interface Params<TParam> {
  variables: TParam;
}

export interface QueryResult<TParam, TData> {
  loading: Ref<boolean>;
  data: Ref<TData>;
  refetch: (params: Params<TParam>) => void;
  error: Ref<any>;
}

export const useQuery = <TParam, TData>(
  request: (params?: TParam) => Promise<TData>,
  params?: Params<TParam>
): QueryResult<TParam, TData> => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<TData>(undefined);

  const refetch = (executeParams: Params<TParam>) => {
    if (!Object.keys(executeParams.variables)) {
      executeParams = params;
    }
    execute(executeParams);
  };

  function execute(args: Params<TParam>) {
    loading.value = true;
    return request(args.variables)
      .then(result => {
        data.value = result;
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
    refetch
  };
};
