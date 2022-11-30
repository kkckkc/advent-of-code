export const assertEquals = (a: any, b: any) => {
  if (a === b) {
    console.log(`OK ${a} === ${b}`);
  } else {
    console.error(`ERROR: Expected ${b}, but got ${a}`);
  }
}