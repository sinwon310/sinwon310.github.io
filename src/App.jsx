import { Route, Routes } from "react-router-dom";
import Regist from "./components/members/Regist";
import Home from "./components/Home";
import TopNavi from './components/TopNavi';
import Login from "./components/Login";
import Edit from "./components/members/Edit";

function App() {
  return (<>
    <TopNavi />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/regist" element={<Regist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  </>)
}

export default App;