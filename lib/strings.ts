export const Strings = {
  extract: <T>(s: string, re: RegExp, fn: ((matches: string[]) => T)): T | undefined => {
    const match = s.match(re);
    if (! match) return undefined;
    return fn(match.slice(1));
  }
}