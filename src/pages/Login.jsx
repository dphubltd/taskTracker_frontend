import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";

export default function Login() {
  const [name, setName] = useState("");
  const [uuid, setUUID] = useState("");
  const [namelist, setNameList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function fetchNames() {
    try {
      const data = await apiGet("/name/");
      setNameList(Array.isArray(data.info) ? data.info : []);
    } catch (err) {
      console.log("Error fetching names:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost("/login/", { name, unique_id: uuid });
      if (data.info === "Login successful") {
        if (data.role === "director") {
          navigate("/director");
        } else {
          navigate("/task");
        }
      } else {
        setError(data.info || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page-enter">
      <div className="card card-glass">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to manage your tasks</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={fetchNames}
              required
            >
              <option value="">Select your name</option>
              {namelist.map((value, index) => (
                <option key={index} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="uuid">Password: </label>
            <input
              id="uuid"
              type="text"
              required
              value={uuid}
              onChange={(e) => setUUID(e.target.value)}
              placeholder="Enter your Password"
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="form-footer">
          Don't have an account? <button onClick={() => navigate("/signup")} className="link-btn">Sign up</button>
        </div>
      </div>
    </div>
  );
}
