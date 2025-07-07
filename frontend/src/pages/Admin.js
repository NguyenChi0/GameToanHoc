import React, { useEffect, useState } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 5;

export default function Admin() {
  const [tab, setTab] = useState("categories");

  // State for Categories
  const [categories, setCategories] = useState([]);
  const [catForm, setCatForm] = useState({ id: null, name: "" });
  const [catPage, setCatPage] = useState(1);
  const [catSearch, setCatSearch] = useState("");

  // State for Lessons
  const [lessons, setLessons] = useState([]);
  const [lesForm, setLesForm] = useState({
    id: null,
    category_id: "",
    name: "",
    required_score: 0,
    operation: "",
    level: 1,
    type: "arithmetic",
  });
  const [lesPage, setLesPage] = useState(1);
  const [lesSearch, setLesSearch] = useState("");

  // State for Questions
  const [questions, setQuestions] = useState([]);
  const [quesForm, setQuesForm] = useState({
    id: null,
    lesson_id: "",
    content: "",
    options: ["", "", "", ""],
    correct_answer: "",
    question_type: "text",
    answer_type: "text",
    image_url: "",
  });
  const [quesPage, setQuesPage] = useState(1);
  const [quesSearch, setQuesSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cRes, lRes, qRes] = await Promise.all([
        API.get("/categories"),
        API.get("/lessons?category_id=all"),
        API.get("/questions?lesson_id=all"),
      ]);
      setCategories(cRes.data);
      setLessons(lRes.data);
      setQuestions(qRes.data);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
    }
  };

  const paginate = (items, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  };

  // Category CRUD
  const onCatSubmit = async () => {
    if (!catForm.name.trim())
      return toast.warning("Tên danh mục không được trống");
    try {
      if (catForm.id) {
        await API.put(`/categories/${catForm.id}`, { name: catForm.name });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await API.post("/categories", { name: catForm.name });
        toast.success("Thêm danh mục mới thành công!");
      }
      setCatForm({ id: null, name: "" });
      loadData();
    } catch (err) {
      toast.error("Có lỗi khi lưu danh mục");
    }
  };

  const onCatEdit = (c) => setCatForm({ id: c.id, name: c.name });

  const onCatDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Xóa danh mục thành công!");
      loadData();
    } catch (err) {
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  // Lesson CRUD
  const onLesSubmit = async () => {
    if (!lesForm.name || !lesForm.category_id)
      return toast.warning("Vui lòng điền đầy đủ thông tin bài học");

    try {
      if (lesForm.id) {
        await API.put(`/lessons/${lesForm.id}`, lesForm);
        toast.success("Cập nhật bài học thành công!");
      } else {
        await API.post("/lessons", lesForm);
        toast.success("Thêm bài học mới thành công!");
      }
      setLesForm({
        id: null,
        category_id: "",
        name: "",
        required_score: 0,
        operation: "",
        level: 1,
        type: "arithmetic",
      });
      loadData();
    } catch (err) {
      toast.error("Lỗi khi lưu bài học");
    }
  };

  const onLesEdit = (l) => setLesForm({ ...l });

  const onLesDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này?")) return;
    try {
      await API.delete(`/lessons/${id}`);
      toast.success("Xóa bài học thành công!");
      loadData();
    } catch (err) {
      toast.error("Lỗi khi xóa bài học");
    }
  };

  // Question CRUD
  const onQuesSubmit = async () => {
    if (!quesForm.lesson_id || !quesForm.content.trim())
      return toast.warning("Vui lòng điền đầy đủ thông tin câu hỏi");

    const hasEmptyOption = quesForm.options.some((opt) => !opt.trim());
    if (hasEmptyOption)
      return toast.warning("Các lựa chọn không được để trống");

    try {
      const payload = {
        ...quesForm,
        options: JSON.stringify(quesForm.options),
      };

      if (quesForm.id) {
        await API.put(`/questions/${quesForm.id}`, payload);
        toast.success("Cập nhật câu hỏi thành công!");
      } else {
        await API.post("/questions", payload);
        toast.success("Thêm câu hỏi thành công!");
      }

      setQuesForm({
        id: null,
        lesson_id: "",
        content: "",
        options: ["", "", "", ""],
        correct_answer: "",
        question_type: "text",
        answer_type: "text",
        image_url: "",
      });
      loadData();
    } catch (err) {
      toast.error("Lỗi khi lưu câu hỏi");
    }
  };

  const onQuesEdit = (q) => {
    let options = [];
    try {
      options = JSON.parse(q.options);
      if (!Array.isArray(options)) {
        options = String(q.options)
          .split(",")
          .map((s) => s.trim());
      }
    } catch (e) {
      options = String(q.options)
        .split(",")
        .map((s) => s.trim());
    }
    while (options.length < 4) options.push("");
    setQuesForm({ ...q, options });
  };

  const onQuesDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      await API.delete(`/questions/${id}`);
      toast.success("Xóa câu hỏi thành công!");
      loadData();
    } catch (err) {
      toast.error("Lỗi khi xóa câu hỏi");
    }
  };

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredLes = lessons.filter((l) =>
    l.name.toLowerCase().includes(lesSearch.toLowerCase())
  );
  const filteredQues = questions.filter((q) =>
    q.content.toLowerCase().includes(quesSearch.toLowerCase())
  );
  const pagedCats = paginate(filteredCats, catPage);
  const pagedLes = paginate(filteredLes, lesPage);
  const pagedQues = paginate(filteredQues, quesPage);

  const getLessonName = (lessonId) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    return lesson ? lesson.name : `ID: ${lessonId}`;
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>📋 Quản trị hệ thống</h1>
      <div style={{ margin: "20px 0", display: "flex", gap: 10 }}>
        <button
          onClick={() => setTab("categories")}
          style={{
            background: tab === "categories" ? "#4CAF50" : "#f0f0f0",
            color: tab === "categories" ? "white" : "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Danh mục
        </button>
        <button
          onClick={() => setTab("lessons")}
          style={{
            background: tab === "lessons" ? "#4CAF50" : "#f0f0f0",
            color: tab === "lessons" ? "white" : "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Bài học
        </button>
        <button
          onClick={() => setTab("questions")}
          style={{
            background: tab === "questions" ? "#4CAF50" : "#f0f0f0",
            color: tab === "questions" ? "white" : "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Câu hỏi
        </button>
      </div>
      {/* Categories Tab */}
      {tab === "categories" && (
        <div>
          <h2>Quản lý danh mục</h2>
          <div
            style={{
              marginBottom: 20,
              padding: 15,
              background: "#f9f9f9",
              borderRadius: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            <label style={{ fontWeight: "bold" }}>Tên danh mục: </label>
            <input
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              style={{ padding: 8, flex: 1, maxWidth: 300 }}
              placeholder="Nhập tên danh mục..."
            />
            <button
              onClick={onCatSubmit}
              style={{
                background: catForm.id ? "#FFA500" : "#4CAF50",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {catForm.id ? "Cập nhật" : "Thêm danh mục"}
            </button>
            {catForm.id && (
              <button
                onClick={() => setCatForm({ id: null, name: "" })}
                style={{
                  background: "#f44336",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: "bold" }}>Tìm kiếm: </label>
            <input
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              style={{ padding: 8, width: 300 }}
              placeholder="Tìm kiếm danh mục..."
            />
          </div>

          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              marginTop: 10,
              borderCollapse: "collapse",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ background: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pagedCats.length > 0 ? (
                pagedCats.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ textAlign: "center" }}>{c.id}</td>
                    <td>{c.name}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => onCatEdit(c)}
                        style={{
                          background: "#2196F3",
                          color: "white",
                          marginRight: 5,
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onCatDelete(c.id)}
                        style={{
                          background: "#f44336",
                          color: "white",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              disabled={catPage === 1}
              onClick={() => setCatPage(catPage - 1)}
              style={{
                padding: "8px 16px",
                background: catPage === 1 ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: catPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Quay lại
            </button>
            <span style={{ fontWeight: "bold" }}>
              {" "}
              Trang {catPage} trên {Math.ceil(filteredCats.length / PAGE_SIZE)}{" "}
            </span>
            <button
              disabled={catPage * PAGE_SIZE >= filteredCats.length}
              onClick={() => setCatPage(catPage + 1)}
              style={{
                padding: "8px 16px",
                background:
                  catPage * PAGE_SIZE >= filteredCats.length
                    ? "#cccccc"
                    : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor:
                  catPage * PAGE_SIZE >= filteredCats.length
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
      {/* Lessons Tab */}
      {tab === "lessons" && (
        <div>
          <h2>Quản lý bài học</h2>
          <div
            style={{
              marginBottom: 20,
              padding: 15,
              background: "#f9f9f9",
              borderRadius: 8,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 15,
            }}
          >
            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Danh mục:{" "}
              </label>
              <select
                value={lesForm.category_id}
                onChange={(e) =>
                  setLesForm({ ...lesForm, category_id: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="">--Chọn danh mục--</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Tên bài học:{" "}
              </label>
              <input
                value={lesForm.name}
                onChange={(e) =>
                  setLesForm({ ...lesForm, name: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
                placeholder="Tên bài học..."
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Điểm yêu cầu:{" "}
              </label>
              <input
                type="number"
                min="0"
                value={lesForm.required_score}
                onChange={(e) =>
                  setLesForm({ ...lesForm, required_score: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Phép toán:{" "}
              </label>
              <input
                value={lesForm.operation}
                onChange={(e) =>
                  setLesForm({ ...lesForm, operation: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
                placeholder="vd: cộng, trừ, nhân, chia, hỗn hợp"
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Level:{" "}
              </label>
              <input
                type="number"
                min="1"
                value={lesForm.level}
                onChange={(e) =>
                  setLesForm({ ...lesForm, level: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Loại bài học:{" "}
              </label>
              <select
                value={lesForm.type}
                onChange={(e) =>
                  setLesForm({ ...lesForm, type: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="arithmetic">Số học</option>
                <option value="visual">Thị giác</option>
              </select>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={onLesSubmit}
                style={{
                  background: lesForm.id ? "#FFA500" : "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                {lesForm.id ? "Cập nhật bài học" : "Thêm bài học"}
              </button>
              {lesForm.id && (
                <button
                  onClick={() =>
                    setLesForm({
                      id: null,
                      category_id: "",
                      name: "",
                      required_score: 0,
                      operation: "",
                      level: 1,
                      type: "arithmetic",
                    })
                  }
                  style={{
                    background: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: "bold" }}>Tìm kiếm: </label>
            <input
              value={lesSearch}
              onChange={(e) => setLesSearch(e.target.value)}
              style={{ padding: 8, width: 300 }}
              placeholder="Tìm kiếm bài học..."
            />
          </div>

          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              marginTop: 10,
              borderCollapse: "collapse",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ background: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Điểm yêu cầu</th>
                <th>Phép toán</th>
                <th>Level</th>
                <th>Loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pagedLes.length > 0 ? (
                pagedLes.map((l) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ textAlign: "center" }}>{l.id}</td>
                    <td>{l.name}</td>
                    <td>{l.category_name}</td>
                    <td style={{ textAlign: "center" }}>{l.required_score}</td>
                    <td style={{ textAlign: "center" }}>{l.operation}</td>
                    <td style={{ textAlign: "center" }}>{l.level}</td>
                    <td style={{ textAlign: "center" }}>{l.type}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => onLesEdit(l)}
                        style={{
                          background: "#2196F3",
                          color: "white",
                          marginRight: 5,
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onLesDelete(l.id)}
                        style={{
                          background: "#f44336",
                          color: "white",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    Không tìm thấy bài học nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              disabled={lesPage === 1}
              onClick={() => setLesPage(lesPage - 1)}
              style={{
                padding: "8px 16px",
                background: lesPage === 1 ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: lesPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Quay lại
            </button>
            <span style={{ fontWeight: "bold" }}>
              {" "}
              Trang {lesPage} trên {Math.ceil(filteredLes.length / PAGE_SIZE)}{" "}
            </span>
            <button
              disabled={lesPage * PAGE_SIZE >= filteredLes.length}
              onClick={() => setLesPage(lesPage + 1)}
              style={{
                padding: "8px 16px",
                background:
                  lesPage * PAGE_SIZE >= filteredLes.length
                    ? "#cccccc"
                    : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor:
                  lesPage * PAGE_SIZE >= filteredLes.length
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
      {/* Questions Tab */}
      {tab === "questions" && (
        <div>
          <h2>Quản lý câu hỏi</h2>
          <div
            style={{
              marginBottom: 20,
              padding: 15,
              background: "#f9f9f9",
              borderRadius: 8,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 15,
            }}
          >
            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Bài học:{" "}
              </label>
              <select
                value={quesForm.lesson_id}
                onChange={(e) =>
                  setQuesForm({ ...quesForm, lesson_id: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="">--Chọn bài học--</option>
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} (ID: {l.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Nội dung:{" "}
              </label>
              <textarea
                value={quesForm.content}
                onChange={(e) =>
                  setQuesForm({ ...quesForm, content: e.target.value })
                }
                style={{ width: "100%", padding: 8, minHeight: 80 }}
                placeholder="Nội dumg câu hỏi..."
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Kiểu câu hỏi:{" "}
              </label>
              <select
                value={quesForm.question_type}
                onChange={(e) =>
                  setQuesForm({ ...quesForm, question_type: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="text">Chữ</option>
                <option value="image">Hình ảnh</option>
              </select>
            </div>

            {quesForm.question_type === "image" && (
              <div>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  URL hình ảnh:{" "}
                </label>
                <input
                  value={quesForm.image_url}
                  onChange={(e) =>
                    setQuesForm({ ...quesForm, image_url: e.target.value })
                  }
                  style={{ width: "100%", padding: 8 }}
                  placeholder="https://example.com/image.png"
                />
              </div>
            )}

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Kiểu đáp án:{" "}
              </label>
              <select
                value={quesForm.answer_type}
                onChange={(e) =>
                  setQuesForm({ ...quesForm, answer_type: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="text">Chữ</option>
                <option value="image">Hình ảnh</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ marginBottom: 10 }}>Đáp án:</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr))",
                  gap: 10,
                }}
              >
                {quesForm.options.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <label style={{ marginRight: 10, width: 100 }}>
                      Đáp án {idx + 1}:{" "}
                    </label>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const arr = [...quesForm.options];
                        arr[idx] = e.target.value;
                        setQuesForm({ ...quesForm, options: arr });
                      }}
                      style={{ flex: 1, padding: 8 }}
                      placeholder={`Đáp án ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Đáp án đúng:{" "}
              </label>
              <select
                value={quesForm.correct_answer}
                onChange={(e) =>
                  setQuesForm({ ...quesForm, correct_answer: e.target.value })
                }
                style={{ width: "100%", padding: 8 }}
              >
                <option value="">--Chọn đáp án đúng--</option>
                {quesForm.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    Đáp án {idx + 1}: {opt || "(empty)"}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={onQuesSubmit}
                style={{
                  background: quesForm.id ? "#FFA500" : "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                {quesForm.id ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
              </button>
              {quesForm.id && (
                <button
                  onClick={() =>
                    setQuesForm({
                      id: null,
                      lesson_id: "",
                      content: "",
                      options: ["", "", "", ""],
                      correct_answer: "",
                      question_type: "text",
                      answer_type: "text",
                      image_url: "",
                    })
                  }
                  style={{
                    background: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: "bold" }}>Tìm kiếm: </label>
            <input
              value={quesSearch}
              onChange={(e) => setQuesSearch(e.target.value)}
              style={{ padding: 8, width: 300 }}
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>

          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              marginTop: 10,
              borderCollapse: "collapse",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ background: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Bài học</th>
                <th>Nội dung câu hỏi</th>
                <th>Kiểu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pagedQues.length > 0 ? (
                pagedQues.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ textAlign: "center" }}>{q.id}</td>
                    <td>{getLessonName(q.lesson_id)}</td>
                    <td>{q.content}</td>
                    <td style={{ textAlign: "center" }}>
                      {q.question_type}/{q.answer_type}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => onQuesEdit(q)}
                        style={{
                          background: "#2196F3",
                          color: "white",
                          marginRight: 5,
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onQuesDelete(q.id)}
                        style={{
                          background: "#f44336",
                          color: "white",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    Không tìm thấy câu hỏi
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              disabled={quesPage === 1}
              onClick={() => setQuesPage(quesPage - 1)}
              style={{
                padding: "8px 16px",
                background: quesPage === 1 ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: quesPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Quay lại
            </button>
            <span style={{ fontWeight: "bold" }}>
              {" "}
              Trang {quesPage} trên {Math.ceil(filteredQues.length / PAGE_SIZE)}{" "}
            </span>
            <button
              disabled={quesPage * PAGE_SIZE >= filteredQues.length}
              onClick={() => setQuesPage(quesPage + 1)}
              style={{
                padding: "8px 16px",
                background:
                  quesPage * PAGE_SIZE >= filteredQues.length
                    ? "#cccccc"
                    : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor:
                  quesPage * PAGE_SIZE >= filteredQues.length
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
