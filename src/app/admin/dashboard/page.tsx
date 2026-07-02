import React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  LogOut,
  Bell,
  ChevronDown,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data to match the image tables
  const employees = [
    {
      name: "Elvis Okorie",
      role: "Developer",
      dept: "IT",
      signIn: "Sept 18, 2025",
      signOut: "Sept 18, 2025",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Promise Onyema",
      role: "Product Designer",
      dept: "IT",
      signIn: "Sept 18, 2025",
      signOut: "Sept 18, 2025",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Chidimma Okpara",
      role: "Product Designer",
      dept: "IT",
      signIn: "Sept 18, 2025",
      signOut: "Sept 18, 2025",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Divine Timothy",
      role: "Developer",
      dept: "IT",
      signIn: "Sept 18, 2025",
      signOut: "Sept 18, 2025",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Favour Ikeh",
      role: "Social Media Manager",
      dept: "Media",
      signIn: "Sept 18, 2025",
      signOut: "Sept 18, 2025",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    },
  ];

  const tasks = [
    {
      employee: "Elvis Okorie",
      task: "Building website",
      date: "June 18, 2025",
      completion: "June 18, 20...",
      status: "Completed",
      progress: "100%",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    },
    {
      employee: "Promise Onyema",
      task: "Landing page",
      date: "June 18, 2025",
      completion: "June 18, 20...",
      status: "In Progress",
      progress: "70%",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    {
      employee: "Chidimma Okpara",
      task: "Checkout flow",
      date: "June 18, 2025",
      completion: "June 18, 20...",
      status: "In Progress",
      progress: "70%",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    {
      employee: "Divine Timothy",
      task: "Dream job website",
      date: "June 18, 2025",
      completion: "June 18, 20...",
      status: "Completed",
      progress: "100%",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    {
      employee: "Favour Ikeh",
      task: "Posting and engaging",
      date: "June 18, 2025",
      completion: "June 18, 20...",
      status: "Completed",
      progress: "100%",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans antialiased text-gray-800">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-full z-10">
        <div>
          {/* Logo Section */}
          <div className="p-6 flex items-center gap-3 border-b border-gray-50">
            <div className="w-8 h-8 flex items-center justify-center bg-[#003A47] text-white font-black rounded-sm transform rotate-45 overflow-hidden">
              <span className="-rotate-45 text-[10px] tracking-tight">LP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#003A47] font-bold text-sm tracking-wider leading-tight">
                Leadpath
              </span>
              <span className="text-gray-400 text-[11px] font-medium tracking-tight">
                Task Tracker
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <a
              href="#dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-[#F0F2F5] text-[#003A47] rounded-lg font-medium text-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <a
              href="#tasks"
              className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium text-sm transition-all"
            >
              <ListTodo className="w-4 h-4" />
              Tasks
            </a>
            <a
              href="#employees"
              className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium text-sm transition-all"
            >
              <Users className="w-4 h-4" />
              Employees
            </a>
          </nav>
        </div>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-gray-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 rounded-lg font-medium text-sm transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* --- TOP HEADER --- */}
        <header className="bg-white h-20 border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Welcome Admin
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Track and monitor every task from one place.
            </p>
          </div>

          {/* Admin Info Elements */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
              <span className="text-sm font-semibold text-gray-800">Admin</span>
            </div>
          </div>
        </header>

        {/* --- CORE CONTENT WRAPPER --- */}
        <main className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* --- DASHBOARD OVERVIEW SECTION --- */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                Dashboard Overview
              </h2>
              <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors">
                Days
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Overview Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Employees Logged In */}
              <div className="bg-[#F4F8FC] p-4 rounded-lg border border-blue-50/50">
                <p className="text-[13px] font-medium text-gray-400">
                  Total Employees Logged In
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">40</p>
                <div className="flex items-center gap-1 text-[11px] text-[#003A47] font-semibold mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>10%</span>
                  <span className="text-gray-400 font-normal">
                    from previous day
                  </span>
                </div>
              </div>

              {/* Card 2: Tasks Submitted Today */}
              <div className="bg-[#F2FBF4] p-4 rounded-lg border border-green-50/50">
                <p className="text-[13px] font-medium text-gray-400">
                  Tasks Submitted Today
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                <div className="flex items-center gap-1 text-[11px] text-[#2E7D32] font-semibold mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>100%</span>
                  <span className="text-gray-400 font-normal">
                    from previous day
                  </span>
                </div>
              </div>

              {/* Card 3: Tasks In Progress */}
              <div className="bg-[#FFF8F8] p-4 rounded-lg border border-red-50/50">
                <p className="text-[13px] font-medium text-gray-400">
                  Tasks In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                <div className="flex items-center gap-1 text-[11px] text-[#C62828] font-semibold mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>100%</span>
                  <span className="text-gray-400 font-normal">
                    from previous day
                  </span>
                </div>
              </div>

              {/* Card 4: Completed Tasks */}
              <div className="bg-[#FFFBF4] p-4 rounded-lg border border-amber-50/50">
                <p className="text-[13px] font-medium text-gray-400">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                <div className="flex items-center gap-1 text-[11px] text-[#D84315] font-semibold mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>100%</span>
                  <span className="text-gray-400 font-normal">
                    from previous day
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* --- EMPLOYEES SECTION --- */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Employees</h2>
              <button className="text-xs font-semibold text-[#003A47] hover:underline">
                See all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFB] text-gray-400 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-6">Employees</th>
                    <th className="py-3 px-6">Roles</th>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6">Time signed In</th>
                    <th className="py-3 px-6">Time signed out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-600">
                  {employees.map((emp, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-6 flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-gray-900 font-semibold">
                          {emp.name}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-500">{emp.role}</td>
                      <td className="py-3 px-6 text-gray-500">{emp.dept}</td>
                      <td className="py-3 px-6 text-gray-400">{emp.signIn}</td>
                      <td className="py-3 px-6 text-gray-400">{emp.signOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- ALL TASKS SECTION --- */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">All Tasks</h2>
              <button className="text-xs font-semibold text-[#003A47] hover:underline">
                See all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFB] text-gray-400 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Task Submitted</th>
                    <th className="py-3 px-6">Date Submitted</th>
                    <th className="py-3 px-6">Completion Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-600">
                  {tasks.map((task, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-6 flex items-center gap-3">
                        <img
                          src={task.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-gray-900 font-semibold">
                          {task.employee}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-700">{task.task}</td>
                      <td className="py-3 px-6 text-gray-400">{task.date}</td>
                      <td className="py-3 px-6 text-gray-400">
                        {task.completion}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`font-semibold ${
                            task.status === "Completed"
                              ? "text-green-600"
                              : "text-amber-500"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-900 font-semibold">
                        {task.progress}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
