import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { userId, password } = form;

    console.log("입력된 아이디:", userId);
    console.log("입력된 비밀번호:", password);

    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    const q = query(
      collection(firestore, "usertest"),
      where("userId", "==", userId),
      where("password", "==", password)
    );

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        localStorage.setItem("userId", userId);
        alert("로그인 성공!");
        setIsLoggedIn(true);
        navigate("/"); // 홈 화면으로 이동
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  if (isLoggedIn) {
    return (
      <div>
        <h1>환영합니다!</h1>
        <p>{localStorage.getItem("userId")}님</p>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="userId"
          placeholder="아이디를 입력하세요"
          value={form.userId}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
