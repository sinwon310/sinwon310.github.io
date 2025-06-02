import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig"; // Firebase 설정 파일 경로
import { Navigate } from "react-router-dom";

function Edit() {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      setIsLoggedIn(false);
    } else {
      setForm((prev) => ({ ...prev, userId })); // 현재 로그인된 사용자 ID 자동 설정
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
  const { userId, name, email, phone, address } = form;

  if (!userId) {
    alert("로그인 정보를 확인할 수 없습니다.");
    return;
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;

  if (Object.keys(updateData).length === 0) {
    alert("수정할 정보를 입력하세요.");
    return;
  }

  const userDocRef = doc(firestore, "usertest", userId);

  updateDoc(userDocRef, updateData)
    .then(() => {
      alert("회원 정보가 성공적으로 수정되었습니다.");
      setForm({ userId, name: "", email: "", phone: "", address: "" });
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      alert("회원 정보 수정에 실패했습니다. 다시 시도하세요.");
    });
};

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div>
          <label>이름</label>
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>휴대전화</label>
          <input
            type="text"
            name="phone"
            placeholder="휴대전화"
            value={form.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>주소</label>
          <input
            type="text"
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}

export default Edit;
