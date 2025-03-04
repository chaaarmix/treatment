import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";
import Navbar from "../components/Navbar";

const UserAccount = () => {
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна

    const handleLogout = () => {
        setUserData(null);
        localStorage.removeItem("userData");
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token"); // Получаем JWT-токен
            if (!token) {
                alert("Вы не авторизованы!");
                return;
            }

            const response = await fetch("http://localhost:5000/delete-account", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`, // Отправляем токен
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem("token"); // Удаляем токен
                window.location.href = "/"; // Перенаправляем на главную
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Ошибка удаления аккаунта:", error);
            alert("Ошибка при удалении аккаунта");
        }
    };


    return (
        <div className="App enter">
            <h2>Аккаунт</h2>
            <button className="btn btn-primary" onClick={handleLogout}>
                Выйти из аккаунта
            </button>
            <button className="btn btn-danger" onClick={() => setIsModalOpen(true)}>
                Удалить аккаунт
            </button>
            <Navbar />

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Вы уверены, что хотите удалить аккаунт?</h3>
                        <p>Это действие нельзя отменить!</p>
                        <div className="modal-buttons">
                            <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                Да, удалить
                            </button>
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAccount;
