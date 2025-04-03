import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserProvider";
import Fuse from "fuse.js";

const API_URL = "http://localhost:5000/treatment"; // URL API

const CalendarPage = () => {
    const { userData } = useContext(UserContext);
    const token = localStorage.getItem("token");
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
    const [isFormOpen, setIsFormOpen] = useState(true);
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
        enabled: !!token,
        staleTime: 0,
    });



    useEffect(() => {
        if (error) {
            console.error("Ошибка при запросе данных:", error);
        }
    }, [error]);

    useEffect(() => {
        console.log("Treatments data:", treatments);
    }, [treatments]);

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
                    comment: newTreatment.comment
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                refetch();
            } else {
                alert("Лекарство не найдено");
            }
        }
    };

    const getTreatmentsForSelectedDate = () => {
        if (!treatments) return [];

        const selectedDateObject = new Date(selectedDate);

        return treatments.filter(treatment => {
            const treatmentStartDate = new Date(treatment.start_date);
            const treatmentEndDate = new Date(treatment.end_date);

            return treatmentStartDate <= selectedDateObject && treatmentEndDate >= selectedDateObject;
        });
    };

    useEffect(() => {
        refetch();
    }, [selectedDate, refetch]);
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        refetch();
    };

    const [medicines, setMedicines] = useState([]);
    const [medicineSuggestions, setMedicineSuggestions] = useState([]);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch('http://localhost:5000/medicines', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMedicines(data);
                } else {
                    console.error('Ошибка загрузки данных');
                }
            } catch (error) {
                console.error('Ошибка при загрузке списка лекарств:', error);
            }
        };

        fetchMedicines();
    }, []);

    const searchMedicines = (medicines, query) => {
        if (!query) return [];
        const fuse = new Fuse(medicines, {
            keys: ['name'],
            includeScore: true,
            threshold: 0.4,
        });

        const results = fuse.search(query).map(result => result.item); // Результаты поиска
        return results;
    };

    useEffect(() => {
        if (newTreatment.medicine) {
            const results = searchMedicines(medicines, newTreatment.medicine);
            setMedicineSuggestions(results);
        } else {
            setMedicineSuggestions([]);
        }
    }, [newTreatment.medicine, medicines]);

    const [expandedMedicineId, setExpandedMedicineId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedMedicineId(expandedMedicineId === id ? null : id);
    };

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

    return (
        <div className="p-4">
            <Navbar />
            <div className="treatment-form">

                <h2 className="text-xl font-bold mb-2">Добавить лечение</h2>
                <button
                    onClick={() => {
                        if (isFormOpen) {
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
                        {medicineSuggestions.length > 0 && newTreatment.medicine && (
                            <ul>
                                <h3>Лекарства в наличии:</h3>
                                {medicineSuggestions.map((med) => (

                                    <li key={med.id}>{med.name}</li>
                                ))}
                            </ul>
                        )}
                        <div className="time-options mb-2">
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.утро}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, утро: e.target.checked}
                                    })}
                                    className="mr-2"
                                />
                                Утро
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.день}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, день: e.target.checked}
                                    })}
                                    className="mr-2"
                                />
                                День
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    checked={newTreatment.time.вечер}
                                    onChange={(e) => setNewTreatment({
                                        ...newTreatment,
                                        time: {...newTreatment.time, вечер: e.target.checked}
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

            <Calendar
                key={selectedDate.toISOString()}
                onChange={handleDateChange}
                onActiveStartDateChange={({activeStartDate}) => {
                    setSelectedDate(activeStartDate);
                    refetch();
                }}
                value={selectedDate}
                tileContent={({ date }) => {
                    const dayTreatments = treatments?.filter(t =>
                        new Date(t.start_date) <= date && new Date(t.end_date) >= date
                    );
                    return dayTreatments?.length ? <div className="bg-green-200 text-xs p-1">+</div> : null;
                }}
                className="personal-calendar"
            />

            {selectedDate && (
                <div className="day-schedule">
                    <h3>Лечение на {selectedDate.toLocaleDateString()}</h3>
                    {getTreatmentsForSelectedDate().length > 0 ? (
                        getTreatmentsForSelectedDate().map((treatment, index) => {
                            const medicine = medicines?.find(med => med.id === treatment.medicine_id);
                            return (
                                <div key={index} className="schedule-item">
                                    <p><strong>{medicine ? medicine.name : "Неизвестное лекарство"}</strong></p>
                                    <p>Время: {treatment.time}</p>
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
