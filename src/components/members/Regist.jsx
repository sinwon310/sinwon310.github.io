import { useState, useEffect } from "react";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebaseConfig"; // firebase.js 파일 경로에 맞게 수정

function Regist(props) {

  const [isUserIdChecked, setIsUserIdChecked] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    emailId: "",
    emailDomain: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
  });
 
  const handleCheckDuplicate = async () => {
  const userId = form.userId.trim();

  if (!userId) {
    alert("아이디를 입력하세요.");
    return;
  }

  const q = query(collection(firestore, "usertest"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("사용 가능한 아이디입니다.");
    setIsUserIdChecked(true);
  } else {
    alert("이미 사용 중인 아이디입니다.");
    setIsUserIdChecked(false);
    }
  };

  
  const [emailSelect, setEmailSelect] = useState("custom");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "userId") {
    setIsUserIdChecked(false); // 아이디 변경 시 중복 확인 상태 초기화
  }
  };

  const handleEmailSelect = (e) => {
    const selectedDomain = e.target.value;
    setEmailSelect(selectedDomain);
    setForm((prev) => ({
      ...prev,
      emailDomain: selectedDomain === "custom" ? "" : selectedDomain,
    }));
  };

  const handlePhoneChange = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 3) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`;
  }
  if (value.length > 8) {
    value = `${value.slice(0, 8)}-${value.slice(8, 12)}`;
  }
  setForm((prev) => ({ ...prev, phone: value }));
  };



  const loadPostcodeScript = () => {
    if (!document.querySelector("#daum-postcode-script")) {
      const script = document.createElement("script");
      script.id = "daum-postcode-script";
      script.src = "https://spi.maps.daum.net/postcode/guidessl";
      script.onload = handleFindZipcode;
      document.body.appendChild(script);
    } else {
      handleFindZipcode();
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => console.log("Daum Postcode script loaded.");
    document.body.appendChild(script);
  }, []);

  const handleFindZipcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error("Daum Postcode API is not available.");
      return;
    }

  new window.daum.Postcode({
    oncomplete: (data) => {
      const fullAddress = data.address; // 전체 주소
      const zoneCode = data.zonecode; // 우편번호
      
      setForm((prev) => ({
        ...prev,
        zipcode: zoneCode,
        address: fullAddress,
      }));
    },
  }).open();
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isUserIdChecked) {
    alert("아이디 중복 확인을 해주세요.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("패스워드가 일치하지 않습니다.");
    return;
  }
  if (!form.zipcode.trim() || !form.address.trim()) {
    alert("우편번호와 주소를 입력하세요.");
    return;
  }

  const userDoc = {
    userId: form.userId.trim(),
    password: form.password,
    name: form.name,
    email: `${form.emailId}@${form.emailDomain}`,
    phone: form.phone,
    address: `${form.zipcode} ${form.address} ${form.detailAddress}`,
  };

  await addDoc(collection(firestore, "usertest"), userDoc);
  alert("회원가입이 완료되었습니다.");
  setForm({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    emailId: "",
    emailDomain: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
  });
};

  return (<>
     <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>회원가입</h1>

      {/* 아이디 */}
      <div>
        <label>아이디</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            name="userId"
            placeholder="아이디를 입력하세요"
            value={form.userId}
            onChange={handleInputChange}
            required
          />
          <button type="button" onClick={handleCheckDuplicate}>
            중복확인
          </button>
        </div>
      </div>

      {/* 패스워드 */}
      <div>
        <label>패스워드</label>
        <input
          type="password"
          name="password"
          placeholder="패스워드를 입력하세요"
          value={form.password}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* 패스워드 확인 */}
      <div>
        <label>패스워드 확인</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="패스워드를 다시 입력하세요"
          value={form.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* 이름 */}
      <div>
        <label>이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* 이메일 */}
      <div>
        <label>이메일</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            name="emailId"
            placeholder="아이디"
            value={form.emailId}
            onChange={handleInputChange}
            required
          />
          <span>@</span>
          <input
            type="text"
            name="emailDomain"
            placeholder="도메인"
            value={form.emailDomain}
            onChange={handleInputChange}
            disabled={emailSelect !== "custom"}
            required
          />
          <select value={emailSelect} onChange={handleEmailSelect}>
            <option value="custom">직접 입력</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
          </select>
        </div>
      </div>

      {/* 휴대전화번호 */}
      <div>
        <label>휴대전화번호</label>
        <input
          type="tel"
          name="phone"
          placeholder="휴대전화번호를 입력하세요"
          value={form.phone}
          onChange={handlePhoneChange}
          required
        />
      </div>

      {/* 우편번호 */}
      <div>
        <label>우편번호</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            name="zipcode"
            placeholder="우편번호"
            value={form.zipcode}
            readOnly
          />
          <button type="button" onClick={handleFindZipcode}>
            우편번호 찾기
          </button>
        </div>
      </div>

      {/* 기본주소 */}
      <div>
        <label>기본주소</label>
        <input
          type="text"
          name="address"
          placeholder="기본주소를 입력하세요"
          value={form.address}
          readOnly
        />
      </div>

      {/* 상세주소 */}
      <div>
        <label>상세주소</label>
        <input
          type="text"
          name="detailAddress"
          placeholder="상세주소를 입력하세요"
          value={form.detailAddress}
          onChange={handleInputChange}
        />
      </div>

      {/* 제출 */}
      <div>
        <button type="submit">
          회원가입
        </button>
      </div>

      
      
    </form>
  </>); 
}
export default Regist;