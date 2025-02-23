import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";

const Enter = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/FirstAidKit");
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="App">
            <div className="enter">
                <div className="enter-block col-container">
                    <div className="img-container enter-block__img">
                        <img src="/assets/images/logo.png" alt="logo" />
                    </div>
                    <form className="enter-form col-container" onSubmit={handleLogin}>
                        <div className="enter-block__input col-container">
                            <input
                                id="login"
                                type="email"
                                placeholder="Email"
                                className="enter__input"
                                onChange={(e)  => setEmail(e.target.value)} required
                            />
                        </div>
                        <div className="enter-block__input col-container">
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="enter__input"
                                onChange={(e)  => setPassword(e.target.value)} required
                            />
                        </div>
                        <a href="/forgot-password" className="enter-remember">Забыли пароль?</a>
                        <input className="enter-btn" type="submit" value="Войти" />
                    </form>
                </div>
                <div className="bottom-block">
                    <h2 className="bottom-title">Добро пожаловать!</h2>
                    <p className="bottom-question">Нет аккаунта?</p>
                    <a href="/Register" className="register-btn">Зарегистрируйся</a>
                </div>
            </div>
        </div>

)
    ;
};

export default Enter;
