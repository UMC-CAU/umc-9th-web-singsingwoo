import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
  } = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.asc);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // if (isPending) {
  //   return <div className="mt-20">로딩중...</div>;
  // }
  if (isError) {
    return <div className="mt-20">에러 발생!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <input
        className="border p-2 rounded-sm"
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isPending && <div>로딩 중...</div>}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2">
        {isFetching && <div>lodading</div>}
      </div>
    </div>
  );
}
