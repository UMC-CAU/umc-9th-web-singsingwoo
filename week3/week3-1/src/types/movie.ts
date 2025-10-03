export type Movie = {
  adult : boolean;
  backdrop_path:string;
  genre_ids:number[];
  id: number;
  original_language: string;
  original_title: string;
  overview:string;
  popularity: number;
  poster_path: string;
  release_date:string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  tagline: string;

}

export type MovieResponse = {
  page:number;
  results: Movie[];
  totalPages:number;
  total_results:number;
}

// src/types/movie.ts (기존 파일에 추가)

// ... 기존 Movie, MovieResponse 타입 ...

// 출연진(배우) 개인의 타입
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// 제작진(감독 등) 개인의 타입
export interface Crew {
  id: number;
  name: string;
  job: string;
}

// Credits API 응답 전체의 타입
export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}