import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserProvider";
import axios from "axios";
import moment from "moment";
import Navbar from "../components/Navbar";

const Notifications = () => {
    const { userData, medications, handleMedicationTakenChange } = useContext(UserContext);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    useEffect(() => {
        console.log("Медикаменты из контекста:", medications);
    }, [medications]);

    useEffect(() => {
        fetchNotifications();
    }, [userData]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/notifications?user_id=${userData.id}`);
            if (response.status === 200) {
            }
        } catch (error) {
            console.error("Ошибка при получении уведомлений:", error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedNotificationId(expandedNotificationId === id ? null : id);
    };

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };

    const getTodaysMedications = () => {
        const today = moment().format("YYYY-MM-DD");
        return medications.filter((med) => {
            const startDate = moment(med.start_date, "YYYY-MM-DD");
            const endDate = moment(med.end_date, "YYYY-MM-DD");
            console.log("Медикаменты из контекста:", medications);

            return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
        });
    };

    const handleMedicationTakenChangeLocal = (medicationId, isTaken) => {
        handleMedicationTakenChange(medicationId, isTaken);

        axios.put("http://localhost:5000/api/medications/update-status", {
            medicationId,
            isTaken
        }).then(response => {
            if (response.status !== 200) {
                console.error("Ошибка при обновлении статуса лекарства на сервере");
            }
        }).catch(error => {
            console.error("Ошибка при отправке запроса:", error);
        });
    };

    return (
        <div className="notifications-page">
            <h1>Уведомления</h1>

            <div className="notification-list">
                {getTodaysMedications().length === 0 ? (
                    <p>Сегодня нет лекарств для принятия.</p>
                ) : (
                    getTodaysMedications().map((med) => (

                        <div key={med.id} className="notification-card">
                            <div className="notification-card__header">
                                <h3>{med.medicine_name} - {med.time}</h3>
                                <p>{med.dosage} дозу(ы) лекарства</p>
                            </div>

                            <div className="notification-card__footer">
                                <label htmlFor={`taken-switch-${med.id}`} className="switch">
                                    <input
                                        type="checkbox"
                                        id={`taken-switch-${med.id}`}
                                        checked={med.taken || false}
                                        onChange={(e) => handleMedicationTakenChangeLocal(med.id, e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            {expandedNotificationId === med.id ? (
                                <div className="notification-card__details">
                                    <p><strong>Начало приема:</strong> {formatDate(med.start_date)}</p>
                                    <p><strong>Конец приема:</strong> {formatDate(med.end_date)}</p>
                                </div>
                            ) : (
                                <p className="expand-text" onClick={() => toggleExpand(med.id)}>
                                    Смотреть подробности
                                </p>
                            )}

                            {expandedNotificationId === med.id && (
                                <p className="collapse-text" onClick={() => toggleExpand(med.id)}>
                                    Свернуть
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Navbar />
        </div>
    );
};

export default Notifications;