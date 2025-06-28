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
    file: "",
    image: "",
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
    const { category_id, name, required_score, file, image } = lesson;
    if (!category_id || !name || !file)
      return alert("Điền đầy đủ thông tin bài học");
    if (required_score < 0) return alert("Điểm yêu cầu không hợp lệ");
    await axios.post("http://localhost:5000/api/lessons", lesson);
    setLesson({
      id: null,
      category_id: "",
      name: "",
      required_score: 0,
      file: "",
      image: "",
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
    const { id, category_id, name, required_score, file, image } = lesson;
    if (!id || !category_id || !name || !file)
      return alert("Thiếu thông tin để cập nhật");
    if (required_score < 0) return alert("Điểm yêu cầu không hợp lệ");
    await axios.put(`http://localhost:5000/api/lessons/${id}`, lesson);
    setLesson({
      id: null,
      category_id: "",
      name: "",
      required_score: 0,
      file: "",
      image: "",
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
            <label>Tên file HTML:</label>
            <br />
            <input
              type="text"
              value={lesson.file}
              onChange={(e) => setLesson({ ...lesson, file: e.target.value })}
              style={{ padding: 8, width: "100%" }}
            />
          </div>
          <div style={{ flex: "1 1 30%" }}>
            <label>Link ảnh minh hoạ:</label>
            <br />
            <input
              type="text"
              value={lesson.image}
              onChange={(e) => setLesson({ ...lesson, image: e.target.value })}
              style={{ padding: 8, width: "100%" }}
            />
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
                    <strong>📘 {item.name}</strong> - File: <em>{item.file}</em>{" "}
                    - Điểm yêu cầu: {item.required_score}
                    {item.image && (
                      <div>
                        <span>🖼️ Hình ảnh minh hoạ:</span>
                        <br />
                        <img
                          src={item.image}
                          alt="preview"
                          width="120"
                          style={{ marginTop: 5 }}
                        />
                      </div>
                    )}
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
