import { useState } from "react";
import { requestLogin, requestLogout } from "../api";

const Navbar = ({ isLogin, setIsLogin }) => {
  const [password, setPassword] = useState('');

  const handleChange = password => {
    setPassword(password);
  };

  const handleLogin = () => {
    requestLogin(password)
      .then(() => {
        setIsLogin(true);
        setPassword('');
      });
  };

  const handleLogout = () => {
    requestLogout()
      .then(() => {
        setIsLogin(false);
      });
  };

  return (
    <nav className="bg-success">
      <nav className="navbar mx-auto text-white">
        <p className="m-0" id="nav-title">TIL Study Tool</p>
        {isLogin ? 
          <button className="btn btn-light btn-sm" onClick={handleLogout}>로그아웃</button> :
          <div className="d-flex">
            <div className="input-group input-group-sm me-2">
              <label className="input-group-text">비밀번호</label>
              <input type="password" value={password} className="form-control" onChange={e => handleChange(e.target.value)} />
            </div>
            <button className="btn btn-light btn-sm" onClick={handleLogin}>로그인</button>
          </div>
        }
      </nav>
    </nav>
  );
}
 
export default Navbar;