import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserProvider";
import Navbar from "../components/Navbar";

const UserAccount = () => {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", birthDate: "", gender: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Загружаем данные при монтировании
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await fetch("http://localhost:5000/me", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setUser({
                        name: data.name || "",
                        birthDate: data.birth_date || "",
                        gender: data.gender || "",
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchUserData();
    }, [setUserData]);

    // Функция для сохранения данных
    const updateUser = async (field, value) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:5000/update-user", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUser((prev) => ({ ...prev, [field]: updatedData[field] }));
                setUserData((prev) => ({ ...prev, [field]: updatedData[field] }));
            }
        } catch (error) {
            console.error("Ошибка сохранения данных:", error);
        }
    };

    // Обработчик изменения инпута
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        updateUser(name, value); // Автосохранение в БД
    };

    // Выход из аккаунта
    const handleLogout = () => {
        setUserData(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        navigate("/");
    };

    // Удаление аккаунта
    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:5000/delete-account", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                localStorage.removeItem("token");
                navigate("/");
            } else {
                alert("Ошибка при удалении аккаунта");
            }
        } catch (error) {
            console.error("Ошибка удаления аккаунта:", error);
        }
    };

    return (
        <div>
            <div className="user-account">
                <h2>Аккаунт</h2>

                {/* Поле ввода имени */}
                <div className="input-group">
                    <label>Имя:</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange}/>
                </div>

                {/* Поле ввода даты рождения */}
                <div className="input-group">
                    <label>Дата рождения:</label>
                    <input type="date" name="birthDate" value={user.birthDate} onChange={handleChange}/>
                </div>

                <div className="gender-group">
                    <div
                        className={`gender-option ${user.gender === "М" ? "selected male" : ""}`}
                        onClick={() => handleChange({target: {name: "gender", value: "М"}})}
                    >
                        <i className="fas fa-mars"></i>
                        Мужской
                    </div>

                    <div
                        className={`gender-option ${user.gender === "Ж" ? "selected female" : ""}`}
                        onClick={() => handleChange({target: {name: "gender", value: "Ж"}})}
                    >
                        <i className="fas fa-venus"></i>
                        Женский
                    </div>
                </div>


                {/* Кнопки управления */}
                <button className="btn btn-primary" onClick={handleLogout}>
                    Выйти из аккаунта
                </button>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Удалить аккаунт
                </button>




            </div>
            {/* Модальное окно подтверждения удаления */}
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
            <Navbar/>
        </div>

    );
};

export default UserAccount;
