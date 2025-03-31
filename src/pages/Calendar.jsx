import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserProvider";
import Fuse from "fuse.js";

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
                    frequency: newTreatment.frequency,
                    comment: newTreatment.comment // Добавляем комментарий
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

    const [medicines, setMedicines] = useState([]); // Список всех лекарств
    const [medicineSuggestions, setMedicineSuggestions] = useState([]); // Для хранения предложений

    // Загружаем список лекарств с сервера
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch('http://localhost:5000/medicines', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Передаем токен для авторизации
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMedicines(data); // Устанавливаем лекарства
                } else {
                    console.error('Ошибка загрузки данных');
                }
            } catch (error) {
                console.error('Ошибка при загрузке списка лекарств:', error);
            }
        };

        fetchMedicines();
    }, []);



    // Функция для поиска медикаментов
    const searchMedicines = (medicines, query) => {
        if (!query) return []; // Если строка пустая, не показываем подсказки
        const fuse = new Fuse(medicines, {
            keys: ['name'], // Поиск по названию лекарства
            includeScore: true,
            threshold: 0.4,  // Порог чувствительности
        });

        const results = fuse.search(query).map(result => result.item); // Результаты поиска
        return results;
    };

    // Отслеживаем изменение введенного названия лекарства
    useEffect(() => {
        if (newTreatment.medicine) {
            const results = searchMedicines(medicines, newTreatment.medicine); // Поиск предложений
            setMedicineSuggestions(results); // Обновляем список предложений
        } else {
            setMedicineSuggestions([]); // Если строка пустая, очищаем список подсказок
        }
    }, [newTreatment.medicine, medicines]); // Следим за изменением названия лекарства

    // Обработчик изменения в поле поиска
    const handleMedicineChange = (e) => {
        setNewTreatment({ ...newTreatment, medicine: e.target.value });
    };

    const getDayScheduleTitle = () => {
        const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return `Лечение на ${dayNames[selectedDate.getDay()]}, ${selectedDate.toLocaleDateString()}`;
    };

    const getTreatmentTimes = (time) => {
        const timeMap = {
            morning: 'Утро',
            afternoon: 'День',
            evening: 'Вечер',
        };

        if (Array.isArray(time)) {
            return time.map(t => timeMap[t]).join(", ");
        }

        return Object.keys(time).map(t => timeMap[t]).join(", ");
    };

    const [expandedMedicineId, setExpandedMedicineId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedMedicineId(expandedMedicineId === id ? null : id);
    };

    // Загружаем список лекарств
    const { data: medicine, isLoading: medicinesLoading } = useQuery({
        queryKey: ["medicine"],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/medicines`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!token,
    });

    // Создаём маппинг ID → объект лекарства
    const medMap = medicine ? Object.fromEntries(medicine.map(med => [med.id, med])) : {};



    return (
        <div className="p-4">
            <Navbar />
            <div className="treatment-form">

                <h2 className="text-xl font-bold mb-2">Добавить лечение</h2>
                <button
                    onClick={() => {
                        if (isFormOpen) {
                            // Преобразовать в кнопку "Сохранить лечение", если форма открыта
                            addTreatment();
                        }
                        setIsFormOpen(!isFormOpen);
                    }}
                    className="toggle-form-button"
                >
                    {isFormOpen ? "Сохранить лечение" : "Показать форму"}
                </button>


                {isFormOpen && (
                    <div className="form-content">
                        <input
                            type="text"
                            placeholder="Лекарство"
                            value={newTreatment.medicine}
                            onChange={(e) => setNewTreatment({...newTreatment, medicine: e.target.value})}
                            className="border p-2 rounded w-full mb-2"
                        />
                        {/* Показываем список предложений только если строка поиска не пуста */}
                        {medicineSuggestions.length > 0 && newTreatment.medicine && (
                            <ul>
                                <h3>Лекарства в наличии:</h3>
                                {medicineSuggestions.map((med) => (

                                    <li key={med.id}>{med.name}</li>
                                ))}
                            </ul>
                        )}

                        {/* Выбор времени приема лекарства */}
                        <div className="time-options mb-2">
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.morning}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, morning: e.target.checked}
                                    })}
                                    className="mr-2"
                                />
                                Утро
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.afternoon}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, afternoon: e.target.checked}
                                    })}
                                    className="mr-2"
                                />
                                День
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.evening}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, evening: e.target.checked}
                                    })}
                                    className="mr-2"
                                />
                                Вечер
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="Дозировка"
                            value={newTreatment.dosage}
                            onChange={(e) => setNewTreatment({...newTreatment, dosage: e.target.value})}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <label>Начало: </label>
                        <input
                            type="date"
                            value={newTreatment.startDate}
                            onChange={(e) => setNewTreatment({...newTreatment, startDate: e.target.value})}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <label>Конец: </label>
                        <input
                            type="date"
                            value={newTreatment.endDate}
                            onChange={(e) => setNewTreatment({...newTreatment, endDate: e.target.value})}
                            className="border p-2 rounded w-full mb-2"
                        />

                        <input
                            type="text"
                            placeholder="Дополнительный комментарий (например, перед едой)"
                            value={newTreatment.comment}
                            onChange={(e) => setNewTreatment({...newTreatment, comment: e.target.value})}
                            className="border p-2 rounded w-full mb-2"
                        />

                    </div>
                )}
            </div>

            {/* Динамический календарь */}
            <Calendar
                key={selectedDate.toISOString()}
                onChange={handleDateChange}
                onActiveStartDateChange={({activeStartDate}) => {
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
                    <h3>Лечение на {selectedDate.toLocaleDateString()}</h3>
                    {getTreatmentsForSelectedDate().length > 0 ? (
                        getTreatmentsForSelectedDate().map((treatment, index) => {
                            const medicine = medicines?.find(med => med.id === treatment.medicine_id);
                            return (
                                <div key={index} className="schedule-item">
                                    <p><strong>{medicine ? medicine.name : "Неизвестное лекарство"}</strong></p>
                                    <p>Время: {getTreatmentTimes(treatment.time)}</p>
                                    <p>Дозировка: {treatment.dosage}</p>
                                    {treatment.comment && <p><strong>Комментарий:</strong> {treatment.comment}</p>}

                                    {medicine && (
                                        <div>
                                            {expandedMedicineId === medicine.id ? (
                                                <>
                                                    <p><strong>Фармакотерапевтическая группа:</strong> {medicine.med_group}</p>
                                                    <p><strong>Описание:</strong> {medicine.description}</p>
                                                    <p><strong>Способ применения:</strong> {medicine.use}</p>
                                                    <p><strong>Показания:</strong> {medicine.indications}</p>
                                                    <p><strong>Состав:</strong> {medicine.compound}</p>
                                                    <p><strong>Противопоказания:</strong> {medicine.contraindications}</p>
                                                    <p><strong>Побочные действия:</strong> {medicine.side_effects}</p>
                                                    <p><strong>Температура хранения:</strong> {medicine.temperature}</p>
                                                </>
                                            ) : (
                                                <p className="expand-text" onClick={() => toggleExpand(medicine.id)}>Смотреть полностью</p>
                                            )}

                                            {expandedMedicineId === medicine.id && (
                                                <p className="collapse-text" onClick={() => toggleExpand(medicine.id)}>Свернуть</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>Нет назначений на этот день</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default CalendarPage;
