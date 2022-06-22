const API_KEY = "1493cb8476f1c7a0447d79e7d2cbd1b8";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string,
    minimum: string
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// movies fetcher함수
export async function getMovies(){
  return ( await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)).json();
}