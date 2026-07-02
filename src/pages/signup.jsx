import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost } from "../api";

// const STAFF_DPTS = [
//   { value: "DpHub", label: "Dp Hub and Tech" },
//   { value: "Career", label: "Career Education and Counsel Dept" },
//   { value: "Operating", label: "Operating Dept" },
//   { value: "SocialMinistry", label: "Social Ministry" },
// ];

// const DIRECTOR_POSITIONS = [
//   { value: "DirCareer", label: "Director of Career, Education and Counseling" },
//   { value: "DirDpHub", label: "Director of Productivity Hub" },
//   { value: "DirOperating", label: "Director of Operations Department" },
// ];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [dpt, setDpt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [pass,setPassword]=useState("")
  const [cpass,setCpassword]=useState("")
  const STAFF_OPTIONS=[
    {value:"IT DEPARTMENT",title: "IT dept"},
    {value:"SOCIAL MEDIA DEPARTMENT",title:"social marketing"},
    {value:'MEDIA/GRAPHICS DEPARTMENT',title:"media/graphics/Product Design"},
    {value:'FACILITY DEPARTMENT',title:"facilty dept"},
    


  ]
  const DIRECTOR_POSITIONS=[
    {value:"director of Engagement",title:'DIRECTOR OF CORPORATE ENGAGEMENT'},
    {value:"director of career education",title:"DIRECTOR OF CAREERR EDUCATION AND COUNSELLING COMMISSION"},
    {value:"director of social ministries",title:"DIRECTOR OF SOCIAL MINISTRIES"},
    {value:"director of productivity",title:"DIRECTOR OF PRODUCTIVITY HUB AND TECH"}

  ]
  // const dptOptions = role === "director" ? DIRECTOR_POSITIONS : STAFF_DPTS;
  // const roleOptions=role="staff"? STAFF_OPTIONS:DIRECTOR_OPTIONS;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);
    if(!pass || !cpass){
      alert('we need your password')
    }
    if (pass != cpass)[
      alert("Password does not match")
    ]
    try {
      const data = await apiPost("/signup/", { name, email, dept: dpt, role });
      setSuccess(data);
      console.log(name)
      console.log(email)
      console.log(role)
      console.log(dpt)
    } catch (err) {
      if (err.message.includes("already") || err.message.includes("exist")) {
        setError("Account already exists. Please log in.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page-enter">
      {success && (
        <div className="modal-overlay" onClick={() => navigate("/login")}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="success-icon" style={{ margin: "0 auto 16px" }}>✓</div>
              <h3 style={{ textAlign: "center" }}>Welcome Aboard!</h3>
              <p style={{ color: "var(--text-light)", marginBottom: 12, textAlign: "center" }}>
                {success.role === "director" ? "Your director access key:" : "Your unique access key:"}
              </p>
              <p className="unique-id" style={{ textAlign: "center" }}>{success.unique_id}</p>
              <p className="save-id-note" style={{ textAlign: "center" }}>Save this key — you'll need it to sign in.</p>
              <button className="btn-primary btn-block" onClick={() => navigate("/login")} style={{ marginTop: 20 }}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="card card-glass">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h2>Create Account</h2>
          <p className="auth-sub">Join the Leadpath Task Tracker</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} maxLength={200} placeholder="Enter your full name" />
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input id="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => { setRole(e.target.value); setDpt(""); }} required>
              <option value="">Select where you belong</option>
              <option value="staff">Staff</option>
              <option value="director">Director</option>
            </select>
          </div>
          <div className="form-group">
            {/* <label htmlFor="dpt">{role === "director" ? "Position" : "Department"}</label>
            <select id="dpt" value={dpt} onChange={(e) => setDpt(e.target.value)} required>
              <option value="">Select {role === "director" ? "position" : "department"}</option>
              {dptOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select> */}
            <label htmlFor="dpt/pos">{role === "director"? "Position": "Department"}</label>
            {
              role==="director"?
              <select
               value={dpt} onChange={(e) => setDpt(e.target.value)} required
              >
                <option value="">Select your Position</option>
                {
                  DIRECTOR_POSITIONS.map((val,i)=>(

                    <option value={val.value} key={i}>{val.title}</option>
                  ))
                }
                
              </select>
              :
              <select 
               value={dpt} onChange={(e) => setDpt(e.target.value)} required
              >
                <option value="">Select your Department</option>
                {
                  STAFF_OPTIONS.map((val,i)=>(

                    <option value={val.value} key={i}>{val.title}</option>
                  ))
                }
                
              </select>

            }
          </div>
          <div>
            <label htmlfor="password">Password</label>
            <br/><br/>
            <input
              type="password"
              placeholder=". . . . . . . ."
              value={pass}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <br/>
          <div>
            <label htmlfor="password">Confirm Password: </label>
            <br/><br/>
            <input
              type="password"
              placeholder=". . . . . . . ."
              value={cpass}
              onChange={(e)=>setCpassword(e.target.value)}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="form-footer">
          Already have an account? <button onClick={() => navigate("/login")} className="link-btn" disabled={loading}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
