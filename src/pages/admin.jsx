import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../api";

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
  const colors = ["#818cf8", "#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#38bdf8"];
  const color = colors[(name || "").charCodeAt(0) % colors.length];
  return (
    <span className="avatar" style={{ background: color + "18", color, borderColor: color + "30" }}>
      {initials}
    </span>
  );
}

function Badge({ children, variant = "default" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      <span>{type === "error" ? "✕" : "✓"}</span>
      {message}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ background: color + "14", color }}>{icon}</div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

const SIDEBAR_ITEMS = [
  { key: "overview", label: "Overview", icon: "📊", color: "#818cf8" },
  { key: "staff", label: "Staff", icon: "👥", color: "#a78bfa" },
  { key: "tasks", label: "Tasks", icon: "✅", color: "#34d399" },
];

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const notify = useCallback((message, type = "success") => setToast({ message, type }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  async function loadDashboard() {
    try {
      const data = await apiGet("/admin/dashboard/");
      setDashboard(data);
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("Failed")) {
        navigate("/admin/login");
      }
      notify("Failed to load dashboard: " + err.message, "error");
    }
  }

  async function loadStaff() {
    try {
      const data = await apiGet("/admin/");
      setStaffList(data.info || []);
    } catch (err) {
      notify("Failed to load staff: " + err.message, "error");
    }
  }

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadDashboard(), loadStaff()]);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function addStaff(fd) {
    try {
      await apiPost("/admin/", Object.fromEntries(fd));
      notify("Staff member added");
      loadStaff();
      loadDashboard();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function deleteStaff(uniqueId) {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      await apiDelete("/admin/", { id: uniqueId });
      notify("Staff member removed");
      loadStaff();
      loadDashboard();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  const counts = {
    overview: dashboard?.total_staff || 0,
    staff: staffList.length,
    tasks: dashboard?.total_tasks || 0,
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="bg-orbs">
        <span className="orb1" />
        <span className="orb2" />
      </div>
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">⚡</div>
          <div>
            <p className="sidebar-title">COMMAND CENTER</p>
            <p className="sidebar-sub">Welcome, {dashboard?.admin || "Admin"}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`sidebar-btn ${tab === item.key ? "active" : ""}`}
              style={{ "--accent": item.color }}
            >
              <span className="sidebar-indicator" />
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {counts[item.key] > 0 && (
                <span className="sidebar-count" style={{ background: tab === item.key ? item.color + "20" : "rgba(255,255,255,0.04)", color: tab === item.key ? item.color : "var(--text-muted)" }}>
                  {counts[item.key]}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate("/")} className="sidebar-btn">
            <span className="sidebar-icon">←</span>
            <span className="sidebar-label">Back to App</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h2 className="admin-title">{SIDEBAR_ITEMS.find((i) => i.key === tab)?.icon} {SIDEBAR_ITEMS.find((i) => i.key === tab)?.label}</h2>
            <p className="admin-subtitle">{counts[tab]} item{counts[tab] !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={loadAll} className="btn-secondary btn-sm">↻ Refresh</button>
        </div>

        {tab === "overview" && (
          <div>
            <div className="stats-grid stagger">
              <StatCard label="Total Staff" value={dashboard?.total_staff || 0} icon="👥" color="#818cf8" />
              <StatCard label="Total Tasks" value={dashboard?.total_tasks || 0} icon="✅" color="#a78bfa" />
              <StatCard label="Departments" value={new Set(staffList.map((s) => s.dpt).filter(Boolean)).size || 0} icon="🏢" color="#34d399" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
              <div className="card">
                <h4 className="card-title">Tasks by Status</h4>
                {dashboard?.tasks_by_status?.length > 0 ? (
                  <div className="status-list">
                    {dashboard.tasks_by_status.map((item, i) => {
                      const pct = dashboard.total_tasks > 0 ? Math.round((item.count / dashboard.total_tasks) * 100) : 0;
                      return (
                        <div key={i}>
                          <div className="status-row">
                            <Badge variant={item.status === "Completed" ? "green" : item.status === "Not Completed" ? "red" : "amber"}>{item.status}</Badge>
                            <span className="status-count">{item.count}</span>
                          </div>
                          <div className="progress-bar" style={{ marginBottom: 4 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, color: item.status === "Completed" ? "#34d399" : item.status === "Not Completed" ? "#fb7185" : "#fbbf24", background: item.status === "Completed" ? "#34d399" : item.status === "Not Completed" ? "#fb7185" : "#fbbf24" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="empty-msg">No tasks yet</p>
                )}
              </div>

              <div className="card">
                <h4 className="card-title">Performer Board</h4>
                {dashboard?.staff_task_counts?.length > 0 ? (
                  <div className="staff-task-list">
                    {dashboard.staff_task_counts.toSorted((a, b) => b.task_count - a.task_count).map((item, i) => (
                      <div key={i} className="staff-task-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", width: 16 }}>#{i + 1}</span>
                          <Avatar name={item.Name} />
                          <span>{item.Name || "Unknown"}</span>
                        </span>
                        <span className="task-count-badge">{item.task_count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-msg">No tasks assigned yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "staff" && (
          <div className="card">
            <div className="card-header">
              <h4 className="card-title" style={{ border: "none", padding: 0, margin: 0 }}>Staff Members</h4>
              <Badge variant="blue">{staffList.length} total</Badge>
            </div>

            <div className="add-form">
              <p className="add-form-title">Register New Member</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  addStaff(fd);
                  e.target.reset();
                }}
                className="form-row"
              >
                <input name="Name" placeholder="Full name" required />
                <input name="Email" type="email" placeholder="Email" required />
                <input name="Unique_id" placeholder="Access key" required />
                <select name="role" required style={{ flex: "1 1 120px", minWidth: 0 }}>
                  <option value="staff">Staff</option>
                  <option value="director">Director</option>
                </select>
                <input name="dpt" placeholder="Department" required />
                <button type="submit" className="btn-primary btn-sm">+ Enroll</button>
              </form>
            </div>

            {staffList.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Email</th>
                      <th>Access Key</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((s, i) => (
                      <tr key={s.id || i}>
                        <td>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar name={s.Name} />{s.Name || "—"}
                          </span>
                        </td>
                        <td style={{ color: "var(--primary)" }}>{s.Email || "—"}</td>
                        <td><code>{s.Unique_id || "—"}</code></td>
                        <td>
                          <Badge variant={s.role === "director" ? "purple" : "blue"}>{s.role || "staff"}</Badge>
                        </td>
                        <td>
                          {s.dpt ? (
                            <Badge variant={s.dpt.toLowerCase().includes("hub") ? "purple" : s.dpt.toLowerCase().includes("career") ? "green" : s.dpt.toLowerCase().includes("social") || s.dpt.toLowerCase().includes("sandd") ? "amber" : "amber"}>{s.dpt}</Badge>
                          ) : "—"}
                        </td>
                        <td>
                          <button onClick={() => deleteStaff(s.Unique_id)} className="btn-icon" title="Remove">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-msg">No staff members yet. Enroll your first member above.</p>
            )}
          </div>
        )}

        {tab === "tasks" && (
          <div>
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              <StatCard label="Total Tasks" value={dashboard?.total_tasks || 0} icon="✅" color="#a78bfa" />
              <StatCard label="Active Staff" value={dashboard?.staff_task_counts?.length || 0} icon="👥" color="#818cf8" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card">
                <h4 className="card-title">Status Distribution</h4>
                {dashboard?.tasks_by_status?.length > 0 ? (
                  <div className="status-list">
                    {dashboard.tasks_by_status.map((item, i) => {
                      const pct = dashboard.total_tasks > 0 ? Math.round((item.count / dashboard.total_tasks) * 100) : 0;
                      return (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                            <Badge variant={item.status === "Completed" ? "green" : item.status === "Not Completed" ? "red" : "amber"}>{item.status}</Badge>
                            <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>{item.count} ({pct}%)</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, color: item.status === "Completed" ? "#34d399" : item.status === "Not Completed" ? "#fb7185" : "#fbbf24", background: item.status === "Completed" ? "#34d399" : item.status === "Not Completed" ? "#fb7185" : "#fbbf24" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="empty-msg">No tasks yet</p>
                )}
              </div>

              <div className="card">
                <h4 className="card-title">Staff Leaderboard</h4>
                {dashboard?.staff_task_counts?.length > 0 ? (
                  <div className="staff-task-list">
                    {dashboard.staff_task_counts.toSorted((a, b) => b.task_count - a.task_count).map((item, i) => (
                      <div key={i} className="staff-task-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "var(--text-muted)", width: 16 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                          <Avatar name={item.Name} />
                          <span>{item.Name || "Unknown"}</span>
                        </span>
                        <span className="task-count-badge">{item.task_count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-msg">No tasks assigned yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}
    </div>
  );
}
