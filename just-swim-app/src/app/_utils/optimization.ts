export const throttle = (callback: Function, ms: number) => {
  let throttled = false;

  return (...args: any) => {
    if (!throttled) {
      throttled = true;

      setTimeout(() => {
        callback(...args);
        throttled = false;
      }, ms);
    }
  };
};