export const useValidator = (
  params: string[],
  onError: Function,
  routeParams: Record<string, string>
) => {
  params.forEach(key => {
    if (!routeParams[key]) {
      onError();
    }
  });
};
