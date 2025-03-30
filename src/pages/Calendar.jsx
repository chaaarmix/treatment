import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserProvider";

const API_URL = "http://localhost:5000/treatment"; // URL API

const CalendarPage = () => {
    const { userData } = useContext(UserContext);  // Извлекаем данные пользователя (если нужно)
    const token = localStorage.getItem("token"); // Получаем токен из localStorage


    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newTreatment, setNewTreatment] = useState({
        medicine: "",
        time: {
            morning: false,
            afternoon: false,
            evening: false
        },
        dosage: "",
        startDate: "",
        endDate: "",
        frequency: "daily"
    });
    const [isFormOpen, setIsFormOpen] = useState(true); // Состояние для открытия/закрытия формы

    // Запрос на получение лечения для выбранного месяца и года
    const { data: treatments, refetch, isLoading, error } = useQuery({
        queryKey: ["treatments", selectedDate.getFullYear(), selectedDate.getMonth() + 1],
        queryFn: async () => {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            console.log(`Requesting treatments for token ${token}, year: ${year}, month: ${month}`);

            const { data } = await axios.get(`${API_URL}/${year}/${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        },
        keepPreviousData: true,
        enabled: !!token, // Запрос делаем только если токен существует
        staleTime: 0, // Отключаем кэширование, чтобы данные подгружались при каждом рендере
    });



    useEffect(() => {
        if (error) {
            console.error("Ошибка при запросе данных:", error);
        }
    }, [error]);

    useEffect(() => {
        console.log("Treatments data:", treatments); // Проверим, что данные приходят корректно
    }, [treatments]);

    // Функция для добавления нового лечения
    const addTreatment = async () => {
        if (newTreatment.medicine && newTreatment.startDate && newTreatment.endDate) {
            const medicine = await axios.get(`${API_URL}/medicines`, { params: { name: newTreatment.medicine } });
            const medicineId = medicine.data[0]?.id;

            if (medicineId) {
                await axios.post("http://localhost:5000/add-treatment", {
                    medicine_id: medicineId,
                    time: Object.keys(newTreatment.time).filter(key => newTreatment.time[key]),
                    dosage: newTreatment.dosage,
                    start_date: newTreatment.startDate,
                    end_date: newTreatment.endDate,
                    frequency: newTreatment.frequency
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Отправляем токен в заголовке
                    },
                });
                refetch(); // Обновить данные
            } else {
                alert("Лекарство не найдено");
            }
        }
    };

    // Функция для фильтрации назначений по выбранной дате
    const getTreatmentsForSelectedDate = () => {
        if (!treatments) return [];

        const selectedDateObject = new Date(selectedDate);

        return treatments.filter(treatment => {
            const treatmentStartDate = new Date(treatment.start_date);
            const treatmentEndDate = new Date(treatment.end_date);

            // Проверяем, что выбранная дата находится в пределах лечения
            return treatmentStartDate <= selectedDateObject && treatmentEndDate >= selectedDateObject;
        });
    };

    useEffect(() => {
        refetch(); // Перезапрашиваем данные при каждом обновлении страницы
    }, [selectedDate, refetch]);

    // Обработчик смены месяца в календаре
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        refetch(); // Перезапрашиваем данные при смене даты
    };

    return (
        <div className="p-4">
            <Navbar />
            <div className="treatment-form">
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="toggle-form-button"
                >
                    {isFormOpen ? "Скрыть форму" : "Показать форму"}
                </button>

                {isFormOpen && (
                    <div className="form-content">
                        <h2 className="text-xl font-bold mb-2">Добавить лечение</h2>
                        <input
                            type="text"
                            placeholder="Лекарство"
                            value={newTreatment.medicine}
                            onChange={(e) => setNewTreatment({ ...newTreatment, medicine: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />

                        {/* Выбор времени приема лекарства */}
                        <div className="time-options mb-2">
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.morning}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, time: { ...newTreatment.time, morning: e.target.checked } })}
                                    className="mr-2"
                                />
                                Утро
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.afternoon}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, time: { ...newTreatment.time, afternoon: e.target.checked } })}
                                    className="mr-2"
                                />
                                День
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.evening}
                                    onChange={(e) => setNewTreatment({ ...newTreatment, time: { ...newTreatment.time, evening: e.target.checked } })}
                                    className="mr-2"
                                />
                                Вечер
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="Дозировка"
                            value={newTreatment.dosage}
                            onChange={(e) => setNewTreatment({ ...newTreatment, dosage: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <label>Начало: </label>
                        <input
                            type="date"
                            value={newTreatment.startDate}
                            onChange={(e) => setNewTreatment({ ...newTreatment, startDate: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <label>Конец: </label>
                        <input
                            type="date"
                            value={newTreatment.endDate}
                            onChange={(e) => setNewTreatment({ ...newTreatment, endDate: e.target.value })}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button onClick={addTreatment} className="bg-blue-500 text-white p-2 rounded w-full">Добавить</button>
                    </div>
                )}
            </div>

            {/* Динамический календарь */}
            <Calendar
                key={selectedDate.toISOString()}
                onChange={handleDateChange}
                onActiveStartDateChange={({ activeStartDate }) => {
                    setSelectedDate(activeStartDate);
                    refetch(); // Перезапрашиваем данные при смене месяца
                }}
                value={selectedDate}
                tileContent={({ date }) => {
                    const dayTreatments = treatments?.filter(t =>
                        new Date(t.start_date) <= date && new Date(t.end_date) >= date
                    );
                    return dayTreatments?.length ? <div className="bg-green-200 text-xs p-1">{dayTreatments.length} леч.</div> : null;
                }}
                className="personal-calendar"
            />



            {/* Просмотр расписания дня */}
            {selectedDate && (
                <div className="day-schedule">
                    <h3>Лечение на {selectedDate.toDateString()}</h3>
                    {getTreatmentsForSelectedDate().length > 0 ? (
                        getTreatmentsForSelectedDate().map((treatment, index) => (
                            <div key={index} className="schedule-item">
                                <p><strong>{treatment.medicine}</strong></p>
                                <p>Время: {treatment.time}</p>
                                <p>Дозировка: {treatment.dosage}</p>
                            </div>
                        ))
                    ) : (
                        <p>Нет назначений</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
