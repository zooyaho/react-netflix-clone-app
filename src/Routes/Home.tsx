import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {getMovies, IMovie} from '../api';
import styled from 'styled-components';
import {motion, AnimatePresence} from 'framer-motion';
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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

// 6개의 Box컴포넌트를 감쌈.
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
`;

const offset = 6; // 슬라이드에서 한번에 보여줄 영화의 개수를 6으로 설정

const Home = () => {
  const {data, isLoading} = useQuery(['movies', 'nowPlaying'], getMovies);
  const [sliderIndex, setSliderIndex] = useState(0); // page수, api에서 총 19개의 영화를 가져오므로 page는 3개임.(0,1,2)
  const [isLeaving, setIsLeaving] = useState(false); // 원래 있던 Row가 사라지기도 전에 새 Row도 사라지는 걸 방지하는 변수. 두번씩 클릭해도 정상적으로 슬라이드 효과를 냄.

  // isLeaving의 상태를 2번 바꿔 버그를 방지함.
  const toggleLeaving = ()=>{setIsLeaving(prev=> !prev)}

  // sliser index 번호 증가 함수
  const increaseindexHandler = ()=>{
    if(isLeaving) return;
    toggleLeaving(); // 1. 다음 Row로 바뀌기 전에 isLeavig의 상태를 true로 바꿈.
    
    // 영화가 총 몇개인지 확인. 페이지가 상한에 도달했을때 0으로 리셋해줘야 함.
    const totalMovies = data?.results.length;
    console.log(totalMovies);

    setSliderIndex(prev=> prev + 1);
  }
  const decreaseindexHandler = ()=>{
    toggleLeaving();
    setSliderIndex(prev=> prev - 1);
  }

  const rowVariants = {
    hidden: {
      x: window.outerWidth + 1, // 사용자의 화면 크기를 가져와야 자연스럽게 슬라이드 되며 Row와 Row 사이의 gap을 주기위해 +1을 적용.
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth - 1,
    },
  }

  return (
    <Wrapper>{isLoading ? (
      <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner 
            onClick={increaseindexHandler}
            // image path에 대한 fallback(〔컴퓨터〕 （고장시의） 대체 시스템) 설정
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* 2. onExitComplete: exit가 끝날 때 실행되므로 isLeaving상태를 flase로 바꿈 */}
            {/* initial={false}: 컴포넌트가 처음 mount될 때 initial에 해당하는 animation이 적용되지 않음!! */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row 
                // custom={setLeaving}
                key={sliderIndex} // key가 변경 되면 새로운 row를 생성함!
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
              >
                {/* slice(1): 슬라이드에서 banner에 사용한 첫번째 영화는 제외시킴.
                    sliderIndex: page수, api에서 총 19개의 영화를 가져오므로 page는 3개임.
                */}
                {data?.results
                  .slice(1)
                  .slice(offset * sliderIndex, offset * sliderIndex + offset)
                  .map((movie:IMovie) => (
                    <Box 
                      key={movie.id}
                    >{movie.title}</Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};

export default Home;