export const memoize = <K extends number | string | symbol, V, A extends (...args: any) => any>(
  memo: Record<K, V>, 
  keyFn: (key: Parameters<A>) => K, 
  fn: (arg: Parameters<A>) => V): ((arg: Parameters<A>) => V)  => {
    
  return (arg: Parameters<A>): V => {
    const key = keyFn(arg);
    if (memo[key]) return memo[key];
    const v = fn(arg);
    memo[key] = v;
    return v;
  }
};
