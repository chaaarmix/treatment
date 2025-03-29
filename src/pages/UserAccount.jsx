import React, {useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../components/UserProvider";
import Navbar from "../components/Navbar";
import "../styles/UserAccount.css";


const addOneDay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    d.setDate(d.getDate() + 1);
    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, "0");
    const newDay = String(d.getDate()).padStart(2, "0");
    return `${newYear}-${newMonth}-${newDay}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "Не указано";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

const UserAccount = () => {
    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({name: "", birthDate: "", gender: ""});
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await fetch("http://localhost:5000/me", {
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    const rawDate = data.birth_date ? data.birth_date.substring(0, 10) : "";
                    setUser({
                        name: data.name || "",
                        birthDate: rawDate ? addOneDay(rawDate) : "",
                        gender: data.gender || "",
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };
        fetchUserData();
    }, [setUserData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prev) => ({...prev, [name]: value}));
    };

    const saveChanges = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const updatedFields = {
            name: user.name || "",
            birthDate: user.birthDate,
            gender: user.gender || "",
        };

        try {
            const response = await fetch("http://localhost:5000/update-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedFields),
            });
            if (response.ok) {
                const updatedData = await response.json();
                const rawDate = updatedData.birth_date
                    ? updatedData.birth_date.substring(0, 10)
                    : "";
                const fixedDate = rawDate ? addOneDay(rawDate) : "";
                setUser({
                    name: updatedData.name,
                    birthDate: fixedDate,
                    gender: updatedData.gender,
                });
                setUserData({...updatedData, birth_date: fixedDate});
                setIsEditing(false);
            } else {
                alert("Ошибка сохранения данных");
            }
        } catch (error) {
            console.error("Ошибка сохранения данных:", error);
            alert("Не удалось сохранить изменения.");
        }
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await fetch("http://localhost:5000/delete-account", {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`},
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

    const handleLogout = () => {
        setUserData(null);
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>

            <div className="user-account">

                <div className="user-account__header ">

                    Личный кабинет

                </div>


                <div className="user-mainblock">
                    <div className="icon-col row-container">
                        {isEditing ? (<label>Сохранить данные</label>) : (<label>Редактировать данные</label>)}
                        <img
                            src={isEditing ? "/assets/images/save-icon.png" : "/assets/images/edit-icon.png"}
                            alt={isEditing ? "Сохранить" : "Редактировать"}
                            className="icon-btn"
                            onClick={isEditing ? saveChanges : toggleEdit}
                            title={isEditing ? "Сохранить" : "Редактировать"}
                        />
                    </div>
                    <div className="user-inf  col-container">
                        <div className="input-group">
                            <label>Имя:</label>
                            <div className="input-container">
                                {isEditing ? (
                                    <input type="text" name="name" value={user.name} onChange={handleChange}/>
                                ) : (
                                    <span>{user.name}</span>
                                )}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Дата рождения:</label>
                            <div className="input-container">
                                {isEditing ? (
                                    <input type="date" name="birthDate" value={user.birthDate} onChange={handleChange}/>
                                ) : (
                                    <span>{formatDate(user.birthDate)}</span>
                                )}
                            </div>
                        </div>

                        <div className="gender-group">
                            <label>Пол:</label>
                            <div className="input-container">
                                {isEditing ? (
                                    <>
                                        <label className="gender-container">
                                            <input type="radio" name="gender" value="М" checked={user.gender === "М"}
                                                   onChange={handleChange}/>
                                            Мужской
                                        </label>
                                        <label className="gender-container">
                                            <input type="radio" name="gender" value="Ж" checked={user.gender === "Ж"}
                                                   onChange={handleChange}/>
                                            Женский
                                        </label>
                                    </>
                                ) : (
                                    <span>{user.gender === "М" ? "Мужской" : user.gender === "Ж" ? "Женский" : "Не указано"}</span>
                                )}
                            </div>
                        </div>


                        <button className="enter-btn" onClick={handleLogout}>
                            Выйти из аккаунта
                        </button>


                    </div>
                    <button className="btn btn-danger" onClick={() => setIsModalOpen(true)}>
                        Удалить аккаунт
                    </button>


                </div>


            </div>
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
