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

  const [newQ, setNewQ] = useState({
    lesson_id: "",
    content: "",
    correct_answer: "",
    options: "",
    image_url: "",
    question_type: "text",
    answer_type: "text",
  });

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

  const handleAddQuestion = async () => {
    try {
      if (
        !newQ.lesson_id ||
        !newQ.content ||
        !newQ.correct_answer ||
        !newQ.options
      )
        return alert("Vui lòng điền đầy đủ thông tin câu hỏi");
      JSON.parse(newQ.options);
      await axios.post("http://localhost:5000/api/questions", newQ);
      alert("✅ Thêm câu hỏi thành công!");
      setNewQ({
        lesson_id: "",
        content: "",
        correct_answer: "",
        options: "",
        image_url: "",
        question_type: "text",
        answer_type: "text",
      });
    } catch (err) {
      alert("❌ Lỗi khi thêm câu hỏi: " + err.message);
    }
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

      {/* CATEGORY */}
      <div style={{ marginBottom: 40 }}>
        <h2>📁 Quản lý Category</h2>
        <input
          type="text"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          style={{ padding: 8, width: "100%" }}
        />
        {category.id ? (
          <button onClick={handleUpdateCategory}>Cập nhật Category</button>
        ) : (
          <button onClick={handleAddCategory}>Thêm Category</button>
        )}
        <ul style={{ marginTop: 20 }}>
          {categories.map((cat) => (
            <li key={cat.id}>
              📁 {cat.name}
              <button onClick={() => handleEditCategory(cat)}>Sửa</button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                style={{ color: "red" }}
              >
                Xoá
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* LESSON */}
      <div style={{ marginBottom: 40 }}>
        <h2>📘 Quản lý Bài Học</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <select
            value={lesson.category_id}
            onChange={(e) =>
              setLesson({ ...lesson, category_id: e.target.value })
            }
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
          />
          <input
            type="number"
            placeholder="Điểm yêu cầu"
            value={lesson.required_score}
            onChange={(e) =>
              setLesson({ ...lesson, required_score: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Phép toán (add, subtract...)"
            value={lesson.operation}
            onChange={(e) =>
              setLesson({ ...lesson, operation: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Cấp độ"
            value={lesson.level}
            onChange={(e) =>
              setLesson({ ...lesson, level: Number(e.target.value) })
            }
          />
          <select
            value={lesson.type}
            onChange={(e) => setLesson({ ...lesson, type: e.target.value })}
          >
            <option value="arithmetic">Số học</option>
            <option value="visual">Hình ảnh</option>
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          {lesson.id ? (
            <button onClick={handleUpdateLesson}>Cập nhật Bài học</button>
          ) : (
            <button onClick={handleAddLesson}>Thêm Bài học</button>
          )}
        </div>

        <h3 style={{ marginTop: 30 }}>📋 Danh sách bài học</h3>
        {categories.map((cat) => (
          <div key={cat.id}>
            <h4>📁 {cat.name}</h4>
            <ul>
              {lessons
                .filter((l) => l.category_id === cat.id)
                .map((item) => (
                  <li key={item.id}>
                    📘 {item.name} - Phép toán: {item.operation} - Level:{" "}
                    {item.level} - Type: {item.type}
                    <button onClick={() => handleEditLesson(item)}>Sửa</button>
                    <button
                      onClick={() => handleDeleteLesson(item.id)}
                      style={{ color: "red" }}
                    >
                      Xoá
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* QUESTIONS */}
      <div style={{ marginTop: 40 }}>
        <h2>📝 Thêm câu hỏi mới</h2>
        <select
          value={newQ.lesson_id}
          onChange={(e) => setNewQ({ ...newQ, lesson_id: e.target.value })}
        >
          <option value="">-- Chọn bài học --</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nội dung câu hỏi"
          value={newQ.content}
          onChange={(e) => setNewQ({ ...newQ, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Đáp án đúng"
          value={newQ.correct_answer}
          onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })}
        />
        <input
          type="text"
          placeholder='Đáp án (dạng JSON: ["2","3","5"])'
          value={newQ.options}
          onChange={(e) => setNewQ({ ...newQ, options: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link ảnh minh họa (nếu có)"
          value={newQ.image_url}
          onChange={(e) => setNewQ({ ...newQ, image_url: e.target.value })}
        />
        <select
          value={newQ.question_type}
          onChange={(e) => setNewQ({ ...newQ, question_type: e.target.value })}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        <select
          value={newQ.answer_type}
          onChange={(e) => setNewQ({ ...newQ, answer_type: e.target.value })}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        <button onClick={handleAddQuestion} style={{ marginTop: 10 }}>
          ➕ Thêm câu hỏi
        </button>
      </div>
    </div>
  );
}
