import { ref, Ref } from "@vue/composition-api";

export type RequestType<TParams, TData> = (params?: TParams) => Promise<TData>;

export interface MutationParams<TParam, TData> {
  variables?: TParam;
  update?: (result: TData) => void;
}

export interface MutationResult<Tdata> {
  data: Ref<Tdata> | undefined;
  loading: Ref<boolean>;
  error: Ref<any>;
}

export const useMutation = <TParams = Record<string, any>, TData = any>(
  request: RequestType<TParams, TData>,
  params?: MutationParams<TParams, TData>
): [typeof execute, MutationResult<TData>] => {
  const data = ref<any>(undefined);
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);

  const execute = (execParams?: MutationParams<TParams, TData>) => {
    if (!execParams) {
      execParams = params;
    }
    loading.value = true;
    return request(execParams?.variables)
      .then((result: TData) => {
        data.value = result;
        execParams?.update && execParams.update(result);
      })
      .catch(err => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return [execute, { data, loading, error }];
};
