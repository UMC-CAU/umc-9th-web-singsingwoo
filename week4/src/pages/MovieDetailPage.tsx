import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import type { MovieDetailResponse } from '../types/movie';

const MovieDetailPage = () => {
  const params = useParams();
  const url = `https://api.themoviedb.org/3/movie/${params.movieId}?language=ko-KR`;

  const {
    isPending,
    isError,
    data: movies,
  } = useCustomFetch<MovieDetailResponse>(url);

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(movies?.adult);

  if (isError) {
    return (
      <div>
        <span className="p-10 text-red-500 font-2xl">
          에러가 발생했습니다. 잠시 후 다시 시도해주세요.
        </span>
      </div>
    );
  }

  console.log(params);
  return <div>MovieDetailPage{params.movieId}</div>;
};

export default MovieDetailPage;
