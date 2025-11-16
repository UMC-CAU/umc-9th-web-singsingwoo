import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import type { Likes, ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    //onMutate -> API 요청 이전에 호출되는 함수
    onMutate: async (lp) => {
      // 1. 이 게시글에 관련된 쿼리를 취소
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });
      // 2. 현재 게시글의 데이터를 캐시에서 가져옴.
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp.lpId,
      ]);

      // 게시글 데이터를 복사해서 새로운 객체를 만들기
      // 복사하는 이유는 오류가 발생했을 때 이전 상태로 되돌리기 위해서
      const newLpPost = { ...previousLpPost };

      // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾기
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myinfo,
      ]);

      const userId = Number(me?.data.id);

      const likedIndex =
        previousLpPost?.data.likes.findIndex(
          (like) => like.userId === userId
        ) ?? -1;

      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId: lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }

      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);
      return { previousLpPost, newLpPost };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id
      );
    },
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
        exact: true,
      });
    },
  });
}

export default useDeleteLike;
