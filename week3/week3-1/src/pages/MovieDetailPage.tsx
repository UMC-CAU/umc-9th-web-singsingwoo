
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// ✅ 미션 3: 새로 만든 타입들을 가져옵니다.
import type { Movie, CreditsResponse, Cast, Crew } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  // ✅ 미션 1: useParams로 movieId 가져오기
  const { movieId } = useParams<{ movieId: string }>();

  // ✅ 미션 3: State 관리 (영화 상세 정보, 크레딧 정보, 로딩, 에러)
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        // ✅ 미션 1: Promise.all을 사용해 두 개의 API를 '동시에' 요청합니다.
        const [movieResponse, creditsResponse] = await Promise.all([
          // 1. 영화 상세 정보 요청
          axios.get<Movie>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
          // 2. 영화 크레딧(출연/제작진) 정보 요청
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
        ]);

        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  // ✅ 미션 3: 로딩 및 에러 상태 처리
  if (isPending) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }
  if (isError) {
    return <div className="flex justify-center items-center h-screen"><span className="text-red-500">에러 발생!</span></div>;
  }
  if (!movie || !credits) {
    return <div>영화 정보가 없습니다.</div>;
  }
  

  const director = credits.crew.find((person) => person.job === 'Director');

  const topCast = credits.cast.slice(0, 15);

  // ✅ 미션 2: 영화 상세 정보와 출연진 정보를 화면에 렌더링
  return (
    <div className="p-4 md:p-10">
      {}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          className="w-full md:w-1/3 rounded-lg shadow-2xl"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="flex flex-col justify-center md:w-2/3">
          <h1 className="text-4xl font-extrabold text-gray-800">{movie.title}</h1>
          <p className="text-lg text-gray-500 italic mt-2">{movie.tagline}</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="font-bold text-yellow-500">⭐️ {movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-600">{movie.release_date}</span>
          </div>
          <p className="mt-6 text-gray-700 leading-relaxed">{movie.overview}</p>
          {director && (
            <p className="mt-4 font-semibold">감독: {director.name}</p>
          )}
        </div>
      </div>

      {}
      <div className="mt-14">
        <h2 className="text-3xl font-bold mb-6">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
          {topCast.map((actor) => (
   
            <div key={actor.id} className="flex flex-col items-center gap-2">
              <img
                className="w-auto h-auto rounded-2xl object-cover shadow-lg"
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200'}
                alt={actor.name}
              />
              <div className="text-center">
                <p className="font-bold text-gray-800">{actor.name}</p>
                <p className="text-sm text-gray-500">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}