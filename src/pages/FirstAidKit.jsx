import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserProvider";
import Fuse from "fuse.js";
import Tesseracts from "tesseract.js";

const FirstAidKit = () => {
    const { userData } = useContext(UserContext);
    const [medicine, setMedicine] = useState({ name: "" });
    const [medicines, setMedicines] = useState([]);
    const [expandedMedicineId, setExpandedMedicineId] = useState(null);
    const [filterCategory, setFilterCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = ["Обезболивающее", "Антисептик", "Антибиотик", "Жаропонижающее", "Противоаллергенное", "Противовирусное"];

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/medicines", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Лекарства загружены:", data);
                setMedicines(data);
            } else {
                console.error("Ошибка загрузки лекарств");
            }
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicine((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputName = medicine.name.trim().toLowerCase();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5000/check-medicine?name=${inputName}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok || !data.exists) {
                alert(`Ошибка: "${medicine.name}" нет в базе!`);
                return;
            }

            // ✅ Лекарство найдено в БД, добавляем его
            const addResponse = await fetch("http://localhost:5000/add-medicine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: data.name }),
            });

            if (addResponse.ok) {
                setMedicine({ name: "" });
                fetchMedicines();
            } else {
                console.error("Ошибка добавления лекарства");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };



    const toggleExpand = (id) => {
        setExpandedMedicineId(expandedMedicineId === id ? null : id);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/delete-medicine/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setMedicines(medicines.filter((med) => med.id !== id));
            } else {
                console.error("Ошибка удаления лекарства");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            recognizeText(file);
        }
    };

    const recognizeText = async (file) => {
        setLoading(true);
        try {
            const { data } = await Tesseracts.recognize(file, "rus+eng", {
                logger: (m) => console.log(m),
            });

            const extractedText = data.text.toLowerCase();
            console.log("Распознанный текст:", extractedText);

            const words = extractedText
                .replace(/[^a-zA-Zа-яА-Я\s]/g, "")
                .split(/\s+/) // Разбиваем по пробелам
                .filter((word) => word.length > 3);

            console.log("Фильтрованные слова:", words);

            if (words.length === 0) {
                setMedicine({ name: "" });
                setLoading(false);
                return;
            }

            const fuse = new Fuse(medicines, {
                keys: ["name"],
                includeScore: true,
                threshold: 0.3,
            });

            let foundMedicine = null;

            for (let word of words) {
                const result = fuse.search(word);
                if (result.length > 0) {
                    foundMedicine = result[0].item.name;
                    break;
                }
            }

            if (foundMedicine) {
                setMedicine({ name: foundMedicine });
            } else {
                setMedicine({ name: words[0] });
            }

        } catch (error) {
            console.error("Ошибка распознавания:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredMedicines = filterCategory
        ? medicines.filter((medicine) => medicine.med_group.toLowerCase().includes(filterCategory.toLowerCase()))
        : medicines;

    const searchedMedicines = searchQuery
        ? new Fuse(filteredMedicines, { keys: ["name"], includeScore: true, threshold: 0.4 })
            .search(searchQuery)
            .map((result) => result.item)
        : filteredMedicines;

    return (
        <div>
            <form onSubmit={handleSubmit} className="medicine-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Название лекарства"
                    value={medicine.name}
                    onChange={handleChange}
                    required
                />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {loading && <p>Распознавание...</p>}
                <button type="submit" className="add-btn">Добавить</button>
            </form>

            <div className="filter-block row-container">
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <select
                    id="categoryFilter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="first-aid-kit">
                <h2 className="first-aid-kit_header">Моя аптечка</h2>
                <div className="medicine-list">
                    {searchedMedicines.map((med) => (
                        <div key={med.id} className="medicine-card">
                            <div className="medicine-card__content">
                                <h3>{med.name}</h3>
                                <img
                                    src="/assets/images/medicine(card).png"
                                    alt="Лекарство"
                                    className="medicine-icon"
                                />
                            </div>
                            <p><strong>Фармакотерапевтическая группа:</strong> {med.med_group}</p>

                            {expandedMedicineId === med.id ? (
                                <>
                                    <p><strong>Описание:</strong> {med.description}</p>
                                    <p><strong>Способ применения:</strong> {med.use}</p>
                                    <p><strong>Показания:</strong> {med.indications}</p>
                                    <p><strong>Состав:</strong> {med.compound}</p>
                                    <p><strong>Противопоказания:</strong> {med.contraindications}</p>
                                    <p><strong>Побочные действия:</strong> {med.side_effects}</p>
                                    <p><strong>Температура хранения:</strong> {med.temperature}</p>
                                </>
                            ) : (
                                <p className="expand-text" onClick={() => toggleExpand(med.id)}>Смотреть полностью</p>
                            )}
                            {expandedMedicineId === med.id && (
                                <p className="collapse-text" onClick={() => toggleExpand(med.id)}>Свернуть</p>
                            )}
                            <button className="delete-btn" onClick={() => handleDelete(med.id)}>
                                Закончился
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Navbar/>
        </div>
    );
};

export default FirstAidKit;
