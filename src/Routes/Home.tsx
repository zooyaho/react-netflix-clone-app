import {useQuery} from 'react-query';
import {getMovies} from '../api';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const {data, isLoading} = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data, isLoading);

  return (
    <Wrapper>{isLoading ? <Loader>Loading...</Loader>: null}</Wrapper>
  );
};

export default Home;