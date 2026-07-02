import { useState } from "react";
// import leadpathlogo from ""
import { useNavigate} from "react-router-dom";
export default function AdminLogin(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  async function submit(e){
    e.preventDefault()
    try{
    const info=new FormData();
    info.append("email",email)
    info.append("password",password)
    let response=await fetch("http://localhost:8000/auth/admin/login",{
      method:"POST",
      body:info,
      credentials:"include"
    })
    let req=await response.json();
    if (response.ok){
      // 
      let header=req.headers.get("Authorization");
      localStorage.setItem("auth",header);
      alert("You can Login now")
      navigate("/admin/dashboard")


    }
    else{
      alert("Unable to process login")
    }
    }
    catch(err){
      alert(err)
      console.log(err)
    }
  }
  return(
    <>
    {/*  logo by the left of the admin login page*/}
    {/* whole page div */}
    <div>
      {/* image */}
      <div>
       <img
       src={leadpathlogo}
       alt="LeadpathLogo"
       />


      </div>
      //  the login info
      <div>
          <h3>
            Task Tracker
          </h3>
          <br/><br/><br/><br/>
          <h5>
            Welcome Admin
          </h5>
          <br/><br/><br/>
          <p>
            Monitor all task from one sign in
          </p>
          <br/><br/><br/>
          <form onSubmit={submit}>
          <label htmlfor="email">Email address</label>
          <br/><br/>
          <input
          type="email"
          placeholder="emailaddress@gmail.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <br/><br/>
          <label htmlfor="password">Password</label>
          <input
          type="text"
          placeholder="........"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <br/><br/>
          <button type="submit"> Login</button>
          </form>
      </div>




    </div>
    
    </>

  )
}