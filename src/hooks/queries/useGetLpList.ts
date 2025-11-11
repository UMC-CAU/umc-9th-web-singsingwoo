import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, limit, search, order }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () => getLpList({ cursor, limit, search, order }),

    // 이 시간 동안은 캐시된 데이터를 그대로 사용. 컴포넌트가 마운트되거나 창에 포커스 들어오는 경우도 재요청 X
    // 5분 동안은 기존 데이터 활용, 네트워크 요청 줄임.
    staleTime: 1000 * 60 * 5, // 5 minutes

    // 캐시된 데이터를 얼마 동안 보관할지 설정. 이 시간 이후에는 캐시에서 삭제.
    // staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리에 보관
    // 그 이후에 해당 쿼리가 사용되지 않으면 gcTime이 지난 후에 제거
    gcTime: 1000 * 60 * 10, // 10 minutes

    // 조건에 따라 쿼리 실행 여부 제어
    enabled: Boolean(search), // search 값이 있을 때만 쿼리 실행

    // retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정합니다.

    // initialData: 쿼리 실행 전 미리 제공할 초기 데이터를 설정합니다.

    // keepPreviousData: true로 설정하면, 쿼리 키가 변경될 때 이전 데이터를 유지하면서 새로운 데이터를 로드합니다.
    // 페이지네이션 시 페이지 전환 사이에 이전 데이터를 보여주어 사용자 경험 향상에 도움.
    select: (data) => data.data,
  });
}

export default useGetLpList;
