import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../components/UserProvider";

const Enter = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/enter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data.user); // <-- теперь user будет передаваться

                navigate("/firstAidKit");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Ошибка при входе");
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
                        {error && <p className="error">{error}</p>}
                        <Link to="/forgot-password" className="enter-remember">Забыли пароль?</Link>
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
