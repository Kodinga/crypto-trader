import { useEffect, useRef } from "react";

export const usePrevious = (val: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = val;
  }, [val]);

  return ref.current;
};
