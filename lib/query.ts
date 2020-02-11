import { ref, onMounted } from "@vue/composition-api";

export const useQuery = (
  request: (params?: any) => Promise<any>,
  ...args: any[]
) => {
  const loading = ref<boolean>(false);
  const error = ref<any>(undefined);
  const data = ref<any>(undefined);

  const refetch = (...params: any[]) => {
    if (!params.length) {
      params = args;
    }
    execute(...params);
  };

  function execute(...args: any[]) {
    loading.value = true;
    return request(...args)
      .then(result => {
        data.value = result;
      })
      .then(err => {
        error.value = err;
      });
  }

  onMounted(() => execute(...args));

  return {
    loading,
    error,
    data,
    refetch
  };
};
