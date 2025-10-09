import { useState } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{
    category: string;
  }>();

  const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;

  const {
    data: movies,
    isPending,
    isError,
  } = useCustomFetch<MovieResponse>(url);

  if (isError) {
    return (
      <div>
        <span className="p-10 text-red-500 font-2xl">
          에러가 발생했습니다. 잠시 후 다시 시도해주세요.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center mt-5 gap-6">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-md shadow-md hover:bg-[#b2dab1]
          transititon-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev): number => prev - 1)}
        >
          {'<'}
        </button>
        <span className="p-10 font-bold">{page} page</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-md shadow-md hover:bg-[#b2dab1]
          transititon-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setPage((prev): number => prev + 1)}
        >
          {'>'}
        </button>
      </div>
      {isPending && (
        <div className="flex items-center justify-center mt-10">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div
          className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 
        md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {movies?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
