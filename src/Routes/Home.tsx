import {useQuery} from 'react-query';
import {getMovies} from '../api';
import styled from 'styled-components';
import {makeImagePath} from '../utils';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),url(${(props)=> props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 2vw;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 45%);
  margin-bottom: 20px;
  font-weight: 400;
`;

const Overview = styled.p`
  font-size: 1.4vw;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 45%);
  width: 50%;
`;

const Home = () => {
  const {data, isLoading} = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data, isLoading);

  return (
    <Wrapper>{isLoading ? (
      <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner 
            // image path에 대한 fallback(〔컴퓨터〕 （고장시의） 대체 시스템) 설정
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
};

export default Home;