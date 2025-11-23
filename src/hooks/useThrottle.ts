//useThrottle: 특정 시간 간격으로 함수 실행을 제한하는 커스텀 훅

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay = 500): T {
  //1. 상태 변수 설정 : throttledValue
  //초기값을 전달받은 value
  const [throttledValue, setThrottledValue] = useState<T>(value);

  //2. Ref lastExecuted
  //useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지 않음.
  const lastExecuted = useRef<number>(Date.now());

  //3.useEffect: value, delay가 변경될 때 아래 로직 실행.
  useEffect(() => {
    //현재 시각과 lastExecuted.current에 저장된 마지막 시간 + delay를 비교
    if (Date.now() >= lastExecuted.current + delay) {
      //현재 시간이 지난 후,
      //현재 시각으로 lastExecuted.current 업데이트
      lastExecuted.current = Date.now();
      //최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      //아직 delay 시간이 지나지 않은 경우, delay 시간 후에 업데이트
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      //CleanUp Fuction:
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);
  return throttledValue;
}

export default useThrottle;
