import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setUserData(data.user);
            navigate("/");
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="App">
            <div className="enter">
                <div className="top-block">
                    <h2 className="bottom-title">Добро пожаловать!</h2>
                    <p className="bottom-question">Есть аккаунт?</p>
                    <a href="/" className="register-btn">Войти</a>
                </div>
                <div className="enter-block col-container">
                    <div className="img-container enter-block__img">
                        <img src="/assets/images/logo.png" alt="logo" />
                    </div>
                    <form className="enter-form col-container" onSubmit={handleRegister}>
                        <div className="enter-block__input col-container ">
                            <input
                                id="login"
                                type="email"
                                placeholder="Email"
                                className="enter__input"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="enter-block__input col-container">
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="enter__input"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="enter-block__input col-container">
                            <input
                                type="password"
                                placeholder="Repeat password"
                                className="enter__input"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p className="error">{error}</p>}
                        </div>
                        <a href="/forgot-password" className="enter-remember">Забыли пароль?</a>
                        <input className="enter-btn" type="submit" value="Зарегистрироваться" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
