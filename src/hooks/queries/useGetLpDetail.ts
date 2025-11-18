import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto } from "../../types/lp";

function useGetLpDetail({ lpid }: RequestLpDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpid],
    queryFn: () => getLpDetail({ lpid }),
  });
}

export default useGetLpDetail;
