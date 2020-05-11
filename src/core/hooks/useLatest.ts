import { useRef, useEffect } from "react";

export const useLatest = (value: any) => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  return valueRef;
};
