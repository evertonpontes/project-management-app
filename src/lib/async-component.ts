export const asyncComponent = <T, R>(
  fn: (args: T) => Promise<R>,
): ((args: T) => R) => {
  return fn as (args: T) => R;
};
