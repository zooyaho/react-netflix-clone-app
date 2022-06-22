const API_KEY = "1493cb8476f1c7a0447d79e7d2cbd1b8";
const BASE_PATH = "https://api.themoviedb.org/3";

export async function getMovies(){
  return ( await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)).json();
}