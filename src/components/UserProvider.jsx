import React, { createContext, useState, useEffect } from "react";

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

    const [medications, setMedications] = useState(() => {
        const savedMedications = localStorage.getItem("medications");
        return savedMedications ? JSON.parse(savedMedications) : [];
    });

    useEffect(() => {
        // Сохраняем состояние лекарств в localStorage при изменении
        localStorage.setItem("medications", JSON.stringify(medications));
    }, [medications]);

    // Функция для обновления состояния принятия лекарства
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
