import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    }, [userData]);

    const [medications, setMedications] = useState([]);

    // 🔹 Загружаем лекарства с сервера при изменении userData.id
    useEffect(() => {
        const fetchMedications = async () => {
            if (!userData?.id) return;

            try {
                const response = await axios.get(`http://localhost:5000/notifications?user_id=${userData.id}`);
                console.log("🔹 Полученные лекарства:", response.data);
                setMedications(response.data); // ✅ Загружаем лекарства в состояние
            } catch (error) {
                console.error("Ошибка загрузки медикаментов:", error);
            }
        };

        fetchMedications();
    }, [userData?.id]); // 👈 Перезапуск, если userData.id изменился

    useEffect(() => {
        console.log("🔹 Медикаменты обновлены:", medications);
        localStorage.setItem("medications", JSON.stringify(medications));
    }, [medications]);

    const handleMedicationTakenChange = (medicationId, isTaken) => {
        const updatedMedications = medications.map((med) =>
            med.id === medicationId ? { ...med, taken: isTaken } : med
        );
        setMedications(updatedMedications);
    };

    return (
        <UserContext.Provider value={{ userData, setUserData, medications, handleMedicationTakenChange }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
