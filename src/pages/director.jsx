import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "../api";
import BASE from "../api";

export default function Director() {
  const navigate = useNavigate();
  const [staffTasks, setStaffTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskStatus, setTaskStatus] = useState("In progress");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState("staff-tasks");

  async function loadStaffTasks() {
    try {
      const data = await apiGet("/director/tasks/");
      setStaffTasks(data?.info ?? []);
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403") || err.message.includes("Failed")) {
        navigate("/login");
      }
    }
  }

  async function loadMyTasks() {
    try {
      const data = await apiGet("/director/history/");
      setMyTasks(data?.info ?? []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    Promise.all([loadStaffTasks(), loadMyTasks()]).finally(() => setLoading(false));
  }, []);

  async function handleSubmitTask(e) {
    e.preventDefault();
    if (!taskText.trim()) return;
    setSubmitting(true);
    try {
      const info = new FormData();
      info.append("task", taskText);
      info.append("status", taskStatus);
      await fetch(`${BASE}/director/task/`, {
        method: "POST",
        credentials: "include",
        body: info,
      });
      alert("Director task added!");
      setTaskText("");
      setTaskStatus("In progress");
      loadMyTasks();
    } catch (err) {
      console.log(err);
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

  if (loading) {
    return (
      <div className="auth-page page-enter" style={{ textAlign: "center", paddingTop: 80 }}>
        <div className="spinner" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "var(--text-muted)" }}>Loading director dashboard...</p>
      </div>
    );
  }

  return (
    <div className="task-page page-enter">
      <div className="auth-header" style={{ marginBottom: 24 }}>
        <div className="auth-icon">📋</div>
        <h2>Director Dashboard</h2>
        <p className="auth-sub">Oversee staff tasks and manage your own</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          className={tab === "staff-tasks" ? "btn-primary" : "btn-secondary"}
          onClick={() => setTab("staff-tasks")}
        >
          📊 All Staff Tasks
        </button>
        <button
          className={tab === "my-tasks" ? "btn-primary" : "btn-secondary"}
          onClick={() => setTab("my-tasks")}
        >
          📝 My Director Tasks
        </button>
        <button
          className={tab === "new-task" ? "btn-primary" : "btn-secondary"}
          onClick={() => setTab("new-task")}
        >
          ➕ New Task
        </button>
      </div>

      {tab === "staff-tasks" && (
        <div className="card card-glass">
          <h4 className="card-title">All Staff Tasks (Read Only)</h4>
          {staffTasks.length > 0 ? (
            <div className="history-list">
              {staffTasks.map((t, i) => (
                <div key={i} className="history-item">
                  <div className="history-meta">
                    <span>
                      <strong style={{ color: "var(--text-heading)" }}>{t.staff_name}</strong>
                      <span style={{ color: "var(--text-muted)", marginLeft: 8, fontSize: "0.75rem" }}>
                        {t.staff_dpt}
                      </span>
                    </span>
                    <span className={`badge badge-${statusVariant(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="history-meta" style={{ marginTop: 4 }}>
                    <span className="history-date">{t.date}</span>
                  </div>
                  <p className="history-task">{t.task}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No staff tasks found.</p>
          )}
        </div>
      )}

      {tab === "my-tasks" && (
        <div className="card card-glass">
          <h4 className="card-title">My Director Tasks</h4>
          {myTasks.length > 0 ? (
            <div className="history-list">
              {myTasks.map((t, i) => (
                <div key={i} className="history-item">
                  <div className="history-meta">
                    <span className="history-date">{t.date}</span>
                    <span className={`badge badge-${statusVariant(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="history-task">{t.task}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No director tasks submitted yet.</p>
          )}
        </div>
      )}

      {tab === "new-task" && (
        <div className="card card-glass">
          <h4 className="card-title">Submit Director Task</h4>
          <form onSubmit={handleSubmitTask}>
            <div className="form-group">
              <label htmlFor="dirTask">Task Description</label>
              <textarea
                id="dirTask"
                required
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                rows={4}
                placeholder="Describe your director task..."
                className="task-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dirStatus">Status</label>
              <select
                id="dirStatus"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="task-status-select"
              >
                <option value="In progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Not Completed">Not Completed</option>
              </select>
            </div>
            <button type="submit" className="btn-primary btn-block" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Director Task"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
