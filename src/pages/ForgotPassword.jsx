import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setError("Пожалуйста, введите корректный email");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Ошибка сети");
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Пароль и подтверждение пароля обязательны");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/firstAidKit");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Ошибка сети");
        }
    };

    return (
        <div className="App">
            <div className="enter">
                <div className="top-block">
                    <h2 className="bottom-title">Восстановление пароля</h2>
                    <p className="bottom-question">Есть аккаунт?</p>
                    <Link to="/" className="register-btn">Войти</Link>
                </div>
                <div className="enter-block col-container">
                    <div className="img-container enter-block__img">
                        <img src="/assets/images/logo.png" alt="logo" />
                    </div>

                    {step === 1 ? (
                        <form className="enter-form col-container" onSubmit={handleRegister}>
                            <div className="enter-block__input col-container">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="enter__input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error__text__message">{error}</p>}
                            <input className="enter-btn" type="submit" value="Отправить код" />
                        </form>
                    ) : (
                        <form className="enter-form col-container" onSubmit={handleConfirm}>
                            <div className="enter-block__input col-container">
                                <input
                                    type="text"
                                    placeholder="Код подтверждения"
                                    className="enter__input"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="enter-block__input col-container">
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    className="enter__input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="enter-block__input col-container">
                                <input
                                    type="password"
                                    placeholder="Повторите пароль"
                                    className="enter__input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error__text__message">{error}</p>}
                            <input className="enter-btn" type="submit" value="Подтвердить" />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
