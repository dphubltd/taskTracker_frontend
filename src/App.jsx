import { Routes, Route } from "react-router-dom";


import Signup from "./pages/signup";
import Login from "./pages/Login";
import Task from "./pages/task";
import Admin from "./pages/admin";
import AdminLogin from "./pages/adminLogin";
import Director from "./pages/director";



export default function App() {
 
  return (
    <>
    
     
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="task" element={<Task />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin/dashboard" element={<Admin />} />
          <Route path="director" element={<Director />} />
        </Routes>
   
    </>
  );
}
