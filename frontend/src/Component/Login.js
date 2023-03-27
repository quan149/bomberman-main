import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState } from "react";
import { useNavigate} from "react-router-dom";
import { InputGroup, Form, Modal, Button } from "react-bootstrap";
import "./css/Login.css";
import sessionstorage from "sessionstorage";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, setUser] = useState("");
  const [loginPass, setPass] = useState("");
  const navigate = useNavigate();

  const LoginAccept = async () => {
    setUsername(loginUser);
    setPassword(loginPass);
    console.log(loginUser + " " + loginPass);
    const response = await axios.post("http://localhost:8080/api/v1/auth/signin", {
      username: loginUser,
      password: loginPass,
    });
    navigate("/home", {state:{user: response.data}})
    localStorage.setItem("user", JSON.stringify(response.data))
    console.log(localStorage.getItem("user"))
  };

  return (
    <section className="gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">ĐĂNG NHẬP</h2>
                  <p className="text-white-50 mb-5">
                    Hãy nhập tên tài khoản và mật khẩu!
                  </p>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeEmailX">
                      Tên đăng nhập
                    </label>
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      onChange={(e) => {
                        setUser(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeEmailX">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      onChange={(e) => {
                        setPass(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                    onClick={LoginAccept}
                  >
                    Đăng nhập
                  </button>
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="mb-0">
                    Bigcorp - Dịch vụ cung cấp xe chính hãng trên toàn quốc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
