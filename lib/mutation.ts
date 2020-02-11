import { ref, Ref } from "@vue/composition-api";

export type RequestType<TParams, TData> = (params: TParams) => Promise<TData>;

export interface Params<TParam, TData> {
  variables: TParam;
  update: (result: TData) => void;
}

export interface MutationResult<Tdata> {
  data: Ref<Tdata> | undefined;
  loading: Ref<boolean>;
  error: Ref<any>;
}

export const useMutation = <
  TParams extends Record<string, any>,
  TData extends any
>(
  request: RequestType<TParams, TData>,
  params?: Params<TParams, TData>
): [any, MutationResult<TData>] => {
  const data = ref<TData | undefined>(undefined);
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);

  const execute = (execParams: Params<TParams, TData>) => {
    if (!execParams) {
      execParams = params;
    }
    loading.value = true;
    return request(execParams.variables)
      .then(result => {
        data.value = result;
        loading.value = false;
        execParams.update(result);
      })
      .catch(err => {
        loading.value = false;
        error.value = err;
      });
  };

  return [execute, { data, loading, error }];
};
