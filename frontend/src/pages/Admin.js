// src/pages/Admin.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: null, name: "" });
  const [lesson, setLesson] = useState({
    id: null,
    category_id: "",
    name: "",
    required_score: 0,
    operation: "",
    level: 1,
    type: "arithmetic",
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
    if (!category.name.trim()) return alert("Tên category không được để trống");
    await axios.post("http://localhost:5000/api/categories", {
      name: category.name,
    });
    setCategory({ id: null, name: "" });
    fetchCategories();
  };

  const handleEditCategory = (cat) => {
    setCategory(cat);
  };

  const handleUpdateCategory = async () => {
    if (!category.name.trim()) return alert("Tên category không được để trống");
    await axios.put(`http://localhost:5000/api/categories/${category.id}`, {
      name: category.name,
    });
    setCategory({ id: null, name: "" });
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    fetchCategories();
  };

  const handleAddLesson = async () => {
    const { category_id, name, required_score, operation, level, type } =
      lesson;
    if (!category_id || !name || !operation)
      return alert("Điền đầy đủ thông tin bài học");
    if (required_score < 0) return alert("Điểm yêu cầu không hợp lệ");
    await axios.post("http://localhost:5000/api/lessons", lesson);
    setLesson({
      id: null,
      category_id: "",
      name: "",
      required_score: 0,
      operation: "",
      level: 1,
      type: "arithmetic",
    });
    fetchLessons();
    alert("✅ Thêm bài học thành công!");
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;
    await axios.delete(`http://localhost:5000/api/lessons/${id}`);
    fetchLessons();
  };

  const handleEditLesson = (lesson) => {
    setLesson(lesson);
  };

  const handleUpdateLesson = async () => {
    const { id, category_id, name, required_score, operation, level, type } =
      lesson;
    if (!id || !category_id || !name || !operation)
      return alert("Thiếu thông tin để cập nhật");
    if (required_score < 0) return alert("Điểm yêu cầu không hợp lệ");
    await axios.put(`http://localhost:5000/api/lessons/${id}`, lesson);
    setLesson({
      id: null,
      category_id: "",
      name: "",
      required_score: 0,
      operation: "",
      level: 1,
      type: "arithmetic",
    });
    fetchLessons();
    alert("✅ Cập nhật thành công!");
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🛠️ Trang Quản Trị</h1>

      <div style={{ marginBottom: 40 }}>
        <h2>📁 Quản lý Category</h2>
        <div style={{ marginBottom: 10 }}>
          <label>Tên danh mục:</label>
          <br />
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            style={{ padding: 8, width: "100%" }}
          />
        </div>
        {category.id ? (
          <button onClick={handleUpdateCategory}>Cập nhật Category</button>
        ) : (
          <button onClick={handleAddCategory}>Thêm Category</button>
        )}

        <ul style={{ marginTop: 20 }}>
          {categories.map((cat) => (
            <li key={cat.id} style={{ marginTop: 8 }}>
              📁 {cat.name}
              <button
                onClick={() => handleEditCategory(cat)}
                style={{ marginLeft: 10 }}
              >
                Sửa
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                style={{ marginLeft: 10, color: "red" }}
              >
                Xoá
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2>📘 Quản lý Bài Học</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 30%" }}>
            <label>Chọn danh mục:</label>
            <br />
            <select
              value={lesson.category_id}
              onChange={(e) =>
                setLesson({ ...lesson, category_id: e.target.value })
              }
              style={{ padding: 8, width: "100%" }}
            >
              <option value="">-- Chọn Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Tên bài học:</label>
            <br />
            <input
              type="text"
              value={lesson.name}
              onChange={(e) => setLesson({ ...lesson, name: e.target.value })}
              style={{ padding: 8, width: "100%" }}
            />
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Điểm yêu cầu:</label>
            <br />
            <input
              type="number"
              value={lesson.required_score}
              onChange={(e) =>
                setLesson({ ...lesson, required_score: Number(e.target.value) })
              }
              style={{ padding: 8, width: "100%" }}
            />
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Phép toán (operation):</label>
            <br />
            <input
              type="text"
              value={lesson.operation}
              onChange={(e) =>
                setLesson({ ...lesson, operation: e.target.value })
              }
              style={{ padding: 8, width: "100%" }}
              placeholder="VD: add, subtract, compare"
            />
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Cấp độ (level):</label>
            <br />
            <input
              type="number"
              value={lesson.level}
              onChange={(e) =>
                setLesson({ ...lesson, level: Number(e.target.value) })
              }
              style={{ padding: 8, width: "100%" }}
              min="1"
            />
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Loại (type):</label>
            <br />
            <select
              value={lesson.type}
              onChange={(e) => setLesson({ ...lesson, type: e.target.value })}
              style={{ padding: 8, width: "100%" }}
            >
              <option value="arithmetic">Số học</option>
              <option value="visual">Hình ảnh</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          {lesson.id ? (
            <button onClick={handleUpdateLesson}>Cập nhật Bài học</button>
          ) : (
            <button onClick={handleAddLesson}>Thêm Bài học</button>
          )}
        </div>
      </div>

      <div>
        <h3>📋 Danh sách bài học theo danh mục</h3>
        {categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 30 }}>
            <h4>📁 {cat.name}</h4>
            <ul>
              {lessons
                .filter((l) => l.category_id === cat.id)
                .map((item) => (
                  <li key={item.id} style={{ marginBottom: 10 }}>
                    <strong>📘 {item.name}</strong> - Phép toán:{" "}
                    {item.operation} - Level: {item.level} - Type: {item.type} -
                    Điểm yêu cầu: {item.required_score}
                    <div>
                      <button
                        onClick={() => handleEditLesson(item)}
                        style={{ marginTop: 5, marginRight: 10 }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(item.id)}
                        style={{ color: "red" }}
                      >
                        Xoá
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
