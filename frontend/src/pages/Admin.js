// src/pages/Admin.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [lesson, setLesson] = useState({
    category_id: "",
    name: "",
    required_score: 0,
    file: "",
  });
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchLessons();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const fetchLessons = async () => {
    const res = await axios.get("http://localhost:5000/api/lessons");
    setLessons(res.data);
  };

  const handleAddCategory = async () => {
    if (!categoryName) return alert("Tên category không được để trống");
    await axios.post("http://localhost:5000/api/categories", {
      name: categoryName,
    });
    setCategoryName("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    fetchCategories();
  };

  const handleAddLesson = async () => {
    const { category_id, name, required_score, file } = lesson;
    if (!category_id || !name || !file)
      return alert("Điền đầy đủ thông tin bài học");
    await axios.post("http://localhost:5000/api/lessons", lesson);
    setLesson({ category_id: "", name: "", required_score: 0, file: "" });
    fetchLessons();
  };

  const handleDeleteLesson = async (id) => {
    await axios.delete(`http://localhost:5000/api/lessons/${id}`);
    fetchLessons();
  };

  const handleEditLesson = (lesson) => {
    setLesson(lesson);
  };

  const handleUpdateLesson = async () => {
    const { id, category_id, name, required_score, file } = lesson;
    if (!id || !category_id || !name || !file)
      return alert("Thiếu thông tin để cập nhật");
    await axios.put(`http://localhost:5000/api/lessons/${id}`, lesson);
    setLesson({ category_id: "", name: "", required_score: 0, file: "" });
    fetchLessons();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🛠️ Trang Quản Trị</h1>

      {/* Category Section */}
      <div style={{ marginBottom: 30 }}>
        <h2>📁 Quản lý Category</h2>
        <input
          type="text"
          placeholder="Tên category"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={handleAddCategory}>Thêm Category</button>

        <ul>
          {categories.map((cat) => (
            <li key={cat.id} style={{ marginTop: 8 }}>
              {cat.name}
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                style={{ marginLeft: 10, color: "red" }}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lesson Section */}
      <div style={{ marginBottom: 30 }}>
        <h2>📘 Quản lý Bài Học</h2>
        <select
          value={lesson.category_id}
          onChange={(e) =>
            setLesson({ ...lesson, category_id: e.target.value })
          }
          style={{ padding: 8, marginRight: 10 }}
        >
          <option value="">-- Chọn Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tên bài học"
          value={lesson.name}
          onChange={(e) => setLesson({ ...lesson, name: e.target.value })}
          style={{ padding: 8, marginRight: 10 }}
        />

        <input
          type="number"
          placeholder="Điểm yêu cầu"
          value={lesson.required_score}
          onChange={(e) =>
            setLesson({ ...lesson, required_score: Number(e.target.value) })
          }
          style={{ padding: 8, marginRight: 10, width: 120 }}
        />

        <input
          type="text"
          placeholder="Tên file HTML (ví dụ: game1.html)"
          value={lesson.file}
          onChange={(e) => setLesson({ ...lesson, file: e.target.value })}
          style={{ padding: 8, marginRight: 10 }}
        />

        {lesson.id ? (
          <button onClick={handleUpdateLesson}>Cập Nhật Bài Học</button>
        ) : (
          <button onClick={handleAddLesson}>Thêm Bài Học</button>
        )}
      </div>

      <div>
        <h3>📋 Danh sách bài học</h3>
        <ul>
          {lessons.map((item) => (
            <li key={item.id} style={{ marginBottom: 10 }}>
              📘 {item.name} - File: {item.file} - Điểm yêu cầu:{" "}
              {item.required_score}
              <button
                onClick={() => handleEditLesson(item)}
                style={{ marginLeft: 10 }}
              >
                Sửa
              </button>
              <button
                onClick={() => handleDeleteLesson(item.id)}
                style={{ marginLeft: 10, color: "red" }}
              >
                Xoá
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
