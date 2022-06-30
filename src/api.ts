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

/* movies fetcher함수 */
export async function getMovies(){
  return ( await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)).json();
}

// https://api.themoviedb.org/3/search/multi?api_key=1493cb8476f1c7a0447d79e7d2cbd1b8&language=en-US&query=dune&page=1&include_adult=false

export interface IGetKeywordMoviesResult {
  dates: {
    maximum: string,
    minimum: string
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

/* keyword search fetcher함수 */
// type : multi | person | tv
export async function getKeywordSearch(type:string, keyword:string){
  return ( await fetch(`${BASE_PATH}/search/${type}?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`)).json();
}