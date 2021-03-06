import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {getMovies, IMovie} from '../api';
import styled from 'styled-components';
import {motion, AnimatePresence, useViewportScroll} from 'framer-motion';
import {makeImagePath} from '../utils';
import {useNavigate, useMatch} from 'react-router-dom';

// Icon
import Icon from '@mdi/react';
import { mdiPlay } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiThumbUpOutline } from '@mdi/js';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgphoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),url(${(props)=> props.bgphoto});
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
  top: -150px;
`;

// 6개의 Box컴포넌트를 감쌈.
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const SlideBox = styled(motion.div)<{bgphoto:string}>`
  background-image: url(${props=>props.bgphoto});
  background-size: cover;
  background-position: center center; // 상하좌우 center
  height: 200px;
  color: ${props=> props.theme.white.lighter};
  cursor: pointer;
  &: first-child {
    transform-origin: center left;
  }
  &: last-child {
    transform-origin: center right;
  }
`;

const SlideInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  opacity: 0;
  padding: 10px;
  background-color: ${props=> props.theme.black.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovieModal = styled(motion.div)`
  position: absolute; 
  width: 40vw; 
  height:  80vh;
  background-Color: pink; 
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: #121212;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  padding-bottom:0px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const IntroSection = styled.div`
  display: flex;
  padding: 20px;
  position: relative;
  top: -80px;
`;

const FirWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 70%;
`;

const BtnWrap = styled.div`
  display: flex;
  align-items: center;
  button {
    height: 35px;
    width: 35px;
    margin-right: 10px;
    padding: 5px;
    background-color: transparent;
    border-radius: 35px;
    border: 1.5px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button:nth-child(1) {
    background-color: white;
    border-radius: 10px;
    width: 150px;
    height: 40px;
    font-weight: 600;
    font-size: 18px;
  }
`;

const BigOverview = styled.p`
  margin-top: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const IntroWrap = styled.div`
  flex-basis: 30%;
  font-size: 14px;
  padding-left: 10px;
  strong {
    font-weight: 400;
    color: #555;
    margin-right: 5px;
  }
  li {
    margin-bottom: 5px;
  }
`;


const offset = 6; // 슬라이드에서 한번에 보여줄 영화의 개수를 6으로 설정

const Home = () => {
  const {data, isLoading} = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data);
  const [sliderIndex, setSliderIndex] = useState(0); // page수, api에서 총 19개의 영화를 가져오므로 page는 3개임.(0,1,2)
  const [isLeaving, setIsLeaving] = useState(false); // 원래 있던 Row가 사라지기도 전에 새 Row도 사라지는 걸 방지하는 변수. 두번씩 클릭해도 정상적으로 슬라이드 효과를 냄.
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY }= useViewportScroll(); // 모달창 위치 설정

  // isLeaving의 상태를 2번 바꿔 버그를 방지함.
  const toggleLeaving = ()=>{setIsLeaving(prev=> !prev)}

  // sliser index 번호 증가 함수
  const increaseindexHandler = ()=>{
    if(data){ // data가 있을 경우에만 적용

      if(isLeaving) return;
      toggleLeaving(); // 1. 다음 Row로 바뀌기 전에 isLeavig의 상태를 true로 바꿈.
      
      // 영화가 총 몇개인지 확인. 페이지가 상한에 도달했을때 0으로 리셋해줘야 함.
      const totalMovies = data.results.length - 1; 
      const maxIndex = Math.floor(totalMovies / offset) - 1; // SliderIndex가 0부터 시작하므로 maxIndex는 2로 예상
      setSliderIndex(prev=> prev === maxIndex ? 0 : prev + 1);
    }
  }
  const decreaseindexHandler = ()=>{
    toggleLeaving();
    setSliderIndex(prev=> prev - 1);
  }

  // box클릭 시 URL변경
  const boxClickedHandler = (movieId:number) => navigate(`/movies/${movieId}`);

  // overlay클릭 시 모듈창 닫힘.
  const overlayClickedHandler = () => navigate(`/`);

  // 슬라이드 박스에서 클릭한 영화의 정보
  const clickedMovie = 
    bigMovieMatch?.params.movieId && 
    data?.results.find( (movie:IMovie) => String(movie.id) === bigMovieMatch.params.movieId );

  /* s: Variants */
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
  const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -50,
      transition : {
        delay: .5, // 특정해서 delay를 줌. blur시 delay 적용 안됨.
        duration: 0.3,
        type: "tween",
      }
    }
  }
  const infoVariants = {
    hover: {
      opacity: 1,
      transition : {
        delay: .5,
        duration: 0.3,
        type: "tween",
      }
    },
  }
  /* e: Variants */

  return (
    <Wrapper>{isLoading ? (
      <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner 
            onClick={increaseindexHandler}
            // image path에 대한 fallback(〔컴퓨터〕 （고장시의） 대체 시스템) 설정
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
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
                    <SlideBox 
                      layoutId={movie.id+""} // string형식이어야함.
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{type: "tween"}} // 둘다 설정해야 blur시에도 spring효과가 사라짐.
                      onClick={()=>{boxClickedHandler(movie.id)}}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      {/* <img /> */}
                      <SlideInfo variants={infoVariants} >
                        <h4>{movie.title}</h4>
                      </SlideInfo>
                    </SlideBox>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={overlayClickedHandler} animate={{opacity:1}} />
                <BigMovieModal
                  layoutId={bigMovieMatch.params.movieId + ""}
                  style={{ top: scrollY.get() + 100 }} 
                >
                  {clickedMovie && 
                    <>
                      <BigCover 
                         style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <IntroSection>
                        <FirWrap>
                          <BtnWrap>
                            <button>
                              <Icon 
                                path={mdiPlay}
                                title="play icon"
                                size="35px"/>
                                Play
                            </button>
                            <button>
                              <Icon 
                                path={mdiPlus}
                                title="play icon"
                                size={.7}
                                color="white"/>
                            </button>
                            <button>
                              <Icon 
                                path={mdiThumbUpOutline}
                                title="play icon"
                                size="15px"
                                color="white"/>
                            </button>
                            <button>
                              <Icon 
                                path={mdiThumbUpOutline}
                                title="play icon"
                                size={.7}
                                rotate={180}
                                color="white"/>
                            </button>
                          </BtnWrap>
                          <BigOverview>{clickedMovie.overview}</BigOverview>
                        </FirWrap>
                        <IntroWrap>
                          <ul>
                            <li>
                              <strong>Grading</strong>
                              <span>7.9</span>
                            </li>
                            <li>
                              <strong>Genres</strong>
                              <span>Drama, Comedy</span>
                            </li>
                            <li>
                              <strong>release_date</strong>
                              <span>2022-02-17</span>
                            </li>
                            <li>
                              <strong>runtime</strong>
                              <span>102</span>
                            </li>
                          </ul>
                        </IntroWrap>
                      </IntroSection>
                    </>
                  }
                </BigMovieModal>
              </>
            ) : null}
          </AnimatePresence> 
        </>
      )}
    </Wrapper>
  );
};

export default Home;