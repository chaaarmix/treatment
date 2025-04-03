import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserProvider";
import Fuse from "fuse.js";

const FirstAidKit = () => {
    const { userData } = useContext(UserContext);
    const [medicine, setMedicine] = useState({ name: "" });
    const [medicines, setMedicines] = useState([]);
    const [expandedMedicineId, setExpandedMedicineId] = useState(null);
    const [filterCategory, setFilterCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = ["Обезболивающее", "Антисептик", "Антибиотик", "Жаропонижающее", "Противолаллергенное", "Противовирусное"]; // Пример категорий

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
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/add-medicine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: medicine.name }),
            });

            if (response.ok) {
                setMedicine({ name: "", quantity: "" });
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
                setMedicines(medicines.filter((med) => med.id !== id)); // Убираем из списка
            } else {
                console.error("Ошибка удаления лекарства");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const filterMedicines = (category) => {
        if (!category) return medicines;

        const lowerCategory = category.toLowerCase();
        let filteredByIncludes = medicines.filter((medicine) =>
            medicine.med_group.toLowerCase().includes(lowerCategory)
        );
        const fuse = new Fuse(medicines, {
            keys: ["med_group", "description"],
            includeScore: true,
            threshold: 0.4,
        });

        let fuseResults = fuse.search(category).map((result) => result.item);

        let combinedResults = [...filteredByIncludes, ...fuseResults];

        let uniqueResults = combinedResults.filter(
            (med, index, self) => index === self.findIndex((m) => m.id === med.id)
        );

        return uniqueResults;
    };

    const searchMedicines = (medicines, query) => {
        if (!query) return medicines;
        const fuse = new Fuse(medicines, {
            keys: ["name"],
            includeScore: true,
            threshold: 0.4,
        });

        const results = fuse.search(query).map((result) => result.item);
        return results;
    };


    const filteredMedicines = filterMedicines(filterCategory);
    const searchedMedicines = searchMedicines(filteredMedicines, searchQuery);

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

            <Navbar />
        </div>
    );
};

export default FirstAidKit;
