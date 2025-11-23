import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  //value나 delay가 변경될 때마다 실행
  useEffect(() => {
    //delay(ms) 후에 실행.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    //clean up 함수: effect가 다시 실행되기 전에 이전 타이머를 정리
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  //잠시 기다린 후에 값을 반환.
  return debouncedValue;
}

export default useDebounce;
