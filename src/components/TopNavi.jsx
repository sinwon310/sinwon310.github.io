import { NavLink } from "react-router-dom";

function TopNavi(props) {
  return (<>
    <nav>
      <NavLink to="/">Home</NavLink>&nbsp;&nbsp;
      <NavLink to="/regist">회원가입</NavLink>&nbsp;&nbsp;
      <NavLink to="/login">로그인</NavLink>&nbsp;&nbsp;
      <NavLink to="/edit">회원정보 수정</NavLink>
    </nav>
  </>); 
}
export default TopNavi;