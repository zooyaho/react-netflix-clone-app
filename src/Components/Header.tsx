import {useState, useEffect} from 'react';
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from 'framer-motion';
import {Link, useMatch, useNavigate} from "react-router-dom";
import { useForm } from 'react-hook-form';

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background: linear-gradient(black, transparent);
  font-size: 14px;
  padding: 20px 60px;
  color: white;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  cursor: pointer;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: ${(props) => props.theme.red};
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.lighter};
  transition: font-weight,color 0.3s ease-in-out;
  margin-right: 20px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;

const SearchForm = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const SearchInput = styled(motion.input)`
  background-color: ${props=> props.theme.black.lighter};
  border: 1px solid ${props=> props.theme.white.darker};
  position: absolute;
  right:0px;
  height: 40px;
  width: 250px;
  padding-left: 40px;
  transform-origin: right center; // 변화가 시작하는 위치를 의미함. 
  color: ${props=> props.theme.white.lighter};
  font-size: 16px;
  z-index: -1;
  &:focus {
    outline: none;
  }
`;

const logoVariants = {
  normal: {
    pathLength: 0, 
    fill: "rgba(229, 16, 19, 0)"
  },
  active: {
    pathLength: 1, 
    fill: "rgba(229, 16, 19, 1)",
    transition : {
      default:{ duration: 5 }, // 모든 속성에 적용 됨.
      fill: { duration:2, delay:1 } // 특정 속성에 지정할 수 있음.
    }
  },
}

interface IForm {
  keyword: string;
}

const Header = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const homeMatch = useMatch("/"); // path에 따른 메뉴의 폰트굵기 지정
  const tvMatch = useMatch("tv");
  const inputAnimation = useAnimation(); // animation들을 동시에 실행시킬 때 유용함.
  const navAnimation = useAnimation();
  const {scrollY} = useViewportScroll(); // 스크롤을 움직일 때 제일 밑에서 얼마나 멀리 있는지 알려줌.
  const { register, handleSubmit } = useForm<IForm>();
  const navigate = useNavigate();

  const onValid = (data:IForm)=>{
    // 사용자의 클릭 없이 사용자를 다른 페이지로 이동
    navigate(`/search?keyword=${data.keyword}`); // keyword= : query arguments
  };

  // 검색 토글 버튼 핸들러
  const toggleSearchHandler = ()=>{
    if(toggleSearch){
      inputAnimation.start({ scaleX: 0 });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setToggleSearch(prev=> !prev)
  };

  useEffect(()=>{
    // 스크롤 시 header배경색 변경
    scrollY.onChange(()=>{
      if(scrollY.get() > 80){
        navAnimation.start({backgroundColor: "rgba(0,0,0,1)"});
      } else {
        navAnimation.start({backgroundColor: "rgba(0,0,0,0)"});
      }
    })
  },[scrollY]);

  return (
    <Nav 
      animate={navAnimation}
    >
      <Col>
        <Logo
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path 
            variants={logoVariants}
            initial="normal"
            animate="active"
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>
            <Link style={{fontWeight: homeMatch ? "400" : ""}} to="/">Home</Link> 
          </Item>
          <Item>
            <Link style={{fontWeight: tvMatch ? "400" : ""}} to="tv"> Tv Shows</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <SearchForm onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearchHandler}
            animate={{x: toggleSearch ? "-218px" : "0px"}}
            transition={{type:"linear"}} // 선형적으로 animation지정
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <SearchInput 
            {...register("keyword", { required: true , minLength: 2 })}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            // animate={{scaleX: toggleSearch ? 1 : 0}}
            transition={{type:"linear"}} // 선형적으로 animation지정
            placeholder="Search for movie or tv show..."
          />
        </SearchForm>
      </Col>
    </Nav>
  );
};

export default Header;