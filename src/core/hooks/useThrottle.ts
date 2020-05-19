import { useMemo, useEffect, useState } from "react";
import { throttle } from "lodash";

export const useThrottleFn = <T extends (...args: any) => any>(
  fn: T,
  ms = 1000
) => {
  const throttledFn = useMemo(() => {
    return throttle(fn, ms);
  }, [fn, ms]);

  // fn may call setState.
  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);
  return throttledFn;
};

export const useThrottle = <T>(value: T, ms = 1000) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const throttleFn = useThrottleFn(setThrottledValue, ms);
  throttleFn(value);
  return throttledValue;
};
