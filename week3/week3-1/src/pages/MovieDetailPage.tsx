import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Movie } from "../types/movie"; // Movie 타입을 재사용합니다.
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  // 1. URL에서 movieId를 가져옵니다. (기존 코드와 동일)
  //    타입을 명시해주면 더 좋습니다.
  const { movieId } = useParams<{ movieId: string }>();

  // 2. State를 만듭니다. (목록이 아닌 단일 객체)
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  // 3. movieId가 바뀔 때마다 실행되는 useEffect로 데이터를 불러옵니다.
  useEffect(() => {
    if (!movieId) return; // movieId가 없으면 아무것도 실행하지 않음

    const fetchMovieDetail = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        // 상세 영화 정보를 요청하는 API 엔드포인트를 사용합니다.
        const { data } = await axios.get<Movie>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        // 받아온 데이터(객체)를 state에 저장합니다.
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie detail:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]); // movieId가 변경될 때마다 데이터를 다시 불러옵니다.

  // 4. 로딩 및 에러 상태에 따라 다른 UI를 보여줍니다.
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500">에러가 발생했습니다.</span>
      </div>
    );
  }
  
  // 5. 데이터 로딩이 완료되면 영화 상세 정보를 보여줍니다.
  //    movie가 null일 수 있으니, 한번 더 체크해줍니다.
  if (!movie) {
    return <div>영화 정보가 없습니다.</div>;
  }

  return (
    <div className="p-10">
      <img 
        className="w-full max-w-md mx-auto rounded-lg"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        alt={movie.title} 
      />
      <h1 className="text-4xl font-bold text-center my-6">{movie.title}</h1>
      <p className="text-lg text-gray-700">{movie.overview}</p>
      {/* 필요에 따라 평점, 개봉일 등 다른 정보도 추가할 수 있습니다. */}
    </div>
  );
}