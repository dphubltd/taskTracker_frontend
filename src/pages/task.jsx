import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../api";
import BASE from "../api";

const emptyTask = () => ({ task: "", status: "null" });

export default function Task() {
  const [tasks, setTasks] = useState([emptyTask()]);
  const [hist, setHist] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function addNewTask() {
    setTasks((prev) => [...prev, emptyTask()]);
  }

  function updateTask(index, field, value) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }

  function removeTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  async function gethistory() {
    try {
      const data = await apiGet("/history/");
      setHist(data?.info ?? []);
      setStaffName(data?.staff_name ?? "");
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("Failed")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { gethistory(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const invalid = tasks.some(
      (t) => t.status === "null" || t.task.trim() === "",
    );
    if (invalid) {
      alert("Please fill in all task descriptions and statuses.");
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(
        tasks.map((t) => {
          const info = new FormData();
          info.append("task", t.task);
          info.append("status", t.status);
          return fetch(`${BASE}/task/`, {
            method: "POST",
            credentials: "include",
            body: info,
          });
        }),
      );
      alert("All tasks added successfully!");
      gethistory();
      setTasks([emptyTask()]);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  function statusVariant(status) {
    if (!status || status === "null") return "default";
    const s = status.toLowerCase();
    if (s === "completed") return "green";
    if (s === "in progress") return "amber";
    if (s === "not completed") return "red";
    return "default";
  }

  return (
    <div className="task-page page-enter">
      {staffName && <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: 16, fontSize: "0.9rem" }}>Welcome, <strong style={{ color: "var(--text-heading)" }}>{staffName}</strong></p>}
      <div className="card card-glass" style={{ marginBottom: 24 }}>
        <div className="auth-header" style={{ marginBottom: 16 }}>
          <h2>Task History</h2>
          <p className="auth-sub">Previously submitted tasks</p>
        </div>
        {loading ? (
          <div className="loading">
            <div className="spinner" style={{ margin: "0 auto 12px" }} />
            Loading history...
          </div>
        ) : hist.length > 0 ? (
          <div className="history-list">
            {hist.map((value, index) => (
              <div key={index} className="history-item">
                <div className="history-meta">
                  <span className="history-date">{value.date}</span>
                  <span className={`badge badge-${statusVariant(value.status)}`}>
                    {value.status}
                  </span>
                </div>
                <p className="history-task">{value.task}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-msg">No tasks submitted yet.</p>
        )}
      </div>

      <div className="card card-glass">
        <div className="auth-header" style={{ marginBottom: 16 }}>
          <h2>New Task</h2>
          <p className="auth-sub">Log your progress</p>
        </div>
        <form onSubmit={handleSubmit}>
          {tasks.map((t, index) => (
            <div key={index} className="task-form-item">
              <div className="task-form-header">
                <label>Task {tasks.length > 1 ? `#${index + 1}` : ""}</label>
                {tasks.length > 1 && (
                  <button type="button" onClick={() => removeTask(index)} className="btn-icon" style={{ color: "var(--danger)" }}>✕</button>
                )}
              </div>
              <textarea
                required
                value={t.task}
                onChange={(e) => updateTask(index, "task", e.target.value)}
                rows={3}
                placeholder="Describe the task..."
                className="task-input"
              />
              <select
                value={t.status}
                onChange={(e) => updateTask(index, "status", e.target.value)}
                required
                className="task-status-select"
              >
                <option value="null">Select status</option>
                <option value="In progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Not Completed">Not Completed</option>
              </select>
            </div>
          ))}

          <div className="form-actions">
            <button type="button" onClick={addNewTask} className="btn-secondary">
              + Add Another
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Tasks"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
