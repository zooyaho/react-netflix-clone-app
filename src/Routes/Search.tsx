import { useLocation } from 'react-router';
import { getKeywordSearch } from '../api';
import {useQuery} from 'react-query';

const Search = () => {
  const location = useLocation(); // 현재 URL 정보 반환
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);

  // type : multi | person | tv
  // const {multiData, isMultiLoading} = useQuery(['keywordMovies', 'multi'], getKeywordSearch("multi", keyword));
  // const {personData, isPersonLoading} = useQuery(['keywordMovies', 'person'], getKeywordSearch(person, keyword));
  // const {tvData, isTvLoading} = useQuery(['keywordMovies', 'tv'], getKeywordSearch(tv, keyword));

  // 영화랑 tv관련을 따로 fetch해서 출력하는게 좋을듯
  // https://api.themoviedb.org/3/search/multi?api_key=1493cb8476f1c7a0447d79e7d2cbd1b8&language=en-US&query=dune&page=1&include_adult=false

  return (
    null
  );
};

export default Search;