"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  LogOut,
  ChevronDown,
  TrendingUp,
  ChevronRight,
  X,
  User,
  Circle,
  Calendar,
  Menu,
  Search,
} from "lucide-react";
import { api, logout, formatDate } from "@/lib/api";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const router = useRouter();

  const fetchTasks = async (filter?: string, q?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter) params.filter = filter;
      if (q) params.q = q;
      const allTasks = await api.getAllStaffTasks(
        Object.keys(params).length ? (params as any) : undefined,
      );
      setTasks((allTasks.info || allTasks || []).reverse());
    } catch (err: any) {
      console.error("Failed to load tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const dashboard = await api.getAdminDashboard();
      setDashboardData(dashboard);
      if (dashboard.staff_list) {
        setEmployees(dashboard.staff_list);
      }
    } catch (err: any) {
      if (
        err.message?.includes("Authenticate") ||
        err.message?.includes("credentials")
      ) {
        router.push("/login");
        return;
      }
    }
    await fetchTasks(taskFilter, taskSearch);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterClick = (filt: string) => {
    setTaskFilter(filt);
    fetchTasks(filt, taskSearch);
  };

  const handleSearch = () => {
    fetchTasks(taskFilter, taskSearch);
  };

  useEffect(() => {
    const t = setTimeout(() => fetchTasks(taskFilter, taskSearch), 300);
    return () => clearTimeout(t);
  }, [taskSearch]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FA] flex font-sans antialiased text-gray-800">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`w-64 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-full z-[90] lg:z-20 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div>
            <div className="p-6 flex items-center gap-3 border-b border-gray-50">
              <img
                src="/logo.jpg"
                alt="Leadpath"
                className="w-8 h-8 object-contain rounded"
              />
              <div className="flex flex-col">
                <span className="text-[#003A47] font-bold text-sm tracking-wider leading-tight">
                  Leadpath
                </span>
                <span className="text-gray-400 text-[11px] font-medium tracking-tight">
                  Task Tracker
                </span>
              </div>
            </div>

            <nav className="p-4 space-y-1.5">
              <button
                onClick={() => {
                  setActiveView("dashboard");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeView === "dashboard"
                    ? "bg-[#F0F2F5] text-[#003A47]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView("tasks");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeView === "tasks"
                    ? "bg-[#F0F2F5] text-[#003A47]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ListTodo className="w-4 h-4" />
                Tasks
              </button>
              <button
                onClick={() => {
                  setActiveView("employees");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeView === "employees"
                    ? "bg-[#F0F2F5] text-[#003A47]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4" />
                Employees
              </button>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 rounded-lg font-medium text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 md:pl-64 flex flex-col">
          <header className="bg-white h-20 border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] lg:z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Welcome Admin
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 max-sm:hidden">
                  Track and monitor every task from one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 max-sm:hidden">
              <div className="flex items-center gap-2.5 pl-2">
                <div className="w-9 h-9 rounded-full bg-[#003A47] flex items-center justify-center text-xs font-bold text-white uppercase">
                  A
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Admin
                </span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8 space-y-8 max-w-[1400px] w-full mx-auto">
            {activeView === "dashboard" && (
              <section className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">
                    Dashboard Overview
                  </h2>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors">
                    Days
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#F4F8FC] p-4 rounded-lg border border-blue-50/50">
                    <p className="text-[13px] font-medium text-gray-400">
                      Total Employees Logged In
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {dashboardData?.total_employees ||
                        dashboardData?.logged_in ||
                        0}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#003A47] font-semibold mt-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>10%</span>
                      <span className="text-gray-400 font-normal">
                        from previous day
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#F2FBF4] p-4 rounded-lg border border-green-50/50">
                    <p className="text-[13px] font-medium text-gray-400">
                      Tasks Submitted Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {dashboardData?.tasks_today || 0}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#2E7D32] font-semibold mt-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>100%</span>
                      <span className="text-gray-400 font-normal">
                        from previous day
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFF8F8] p-4 rounded-lg border border-red-50/50">
                    <p className="text-[13px] font-medium text-gray-400">
                      Tasks In Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {dashboardData?.tasks_in_progress || 0}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#C62828] font-semibold mt-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>100%</span>
                      <span className="text-gray-400 font-normal">
                        from previous day
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFBF4] p-4 rounded-lg border border-amber-50/50">
                    <p className="text-[13px] font-medium text-gray-400">
                      Completed Tasks
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {dashboardData?.completed_tasks || 0}
                    </p>
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
            )}

            {(activeView === "dashboard" || activeView === "employees") && (
              <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-50">
                  <h2 className="text-base font-bold text-gray-900">
                    Employees
                  </h2>
                  <button
                    onClick={() => setActiveView("employees")}
                    className="text-xs font-semibold text-[#003A47] hover:underline"
                  >
                    See all
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    Loading...
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No employees found.
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
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
                          {employees.map((emp: any, idx: number) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="py-3 px-6 flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#003A47] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                  {getInitials(emp.Name)}
                                </div>
                                <span className="text-gray-900 font-semibold">
                                  {emp.Name}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-gray-500">
                                {emp.role}
                              </td>
                              <td className="py-3 px-6 text-gray-500">
                                {emp.dpt}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                {emp.auth_created_at || "-"}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                {emp.auth_expire_at || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden divide-y divide-gray-200">
                      {employees.map((emp: any, idx: number) => (
                        <div key={idx} className="p-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#003A47] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                              {getInitials(emp.Name)}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {emp.Name}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 ml-9">
                            <div>
                              <span className="text-gray-400">Role: </span>
                              {emp.role}
                            </div>
                            <div>
                              <span className="text-gray-400">Dept: </span>
                              {emp.dpt}
                            </div>
                            <div>
                              <span className="text-gray-400">In: </span>
                              {emp.auth_created_at || "-"}
                            </div>
                            <div>
                              <span className="text-gray-400">Out: </span>
                              {emp.auth_expire_at || "-"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {(activeView === "dashboard" || activeView === "tasks") && (
              <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 flex flex-wrap items-center gap-3 border-b border-gray-50">
                  <h2 className="text-base font-bold text-gray-900 mr-auto">
                    All Tasks
                  </h2>
                  <div className="relative">
                    <select
                      value={taskFilter}
                      onChange={(e) => handleFilterClick(e.target.value)}
                      className="appearance-none text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#003A47] focus:border-[#003A47] cursor-pointer"
                    >
                      <option value="">All</option>
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-44 pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#003A47] focus:border-[#003A47]"
                      />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveView("tasks")}
                    className="text-xs font-semibold text-[#003A47] hover:underline"
                  >
                    See all
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    Loading...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No tasks found.
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
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
                          {tasks.map((task: any, idx: number) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                              onClick={() => setSelectedTask(task)}
                            >
                              <td className="py-3 px-6 flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#003A47] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                  {getInitials(task.staff_name)}
                                </div>
                                <span className="text-gray-900 font-semibold">
                                  {task.staff_name}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-gray-700">
                                {task.task || task.title}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                {task.date_submitted || task.date}
                              </td>
                              <td className="py-3 px-6 text-gray-400">
                                {formatDate(task.completion_date)}
                              </td>
                              <td className="py-3 px-6">
                                <span
                                  className={`font-semibold ${
                                    task.status === "Completed" ||
                                    task.status === "completed"
                                      ? "text-green-600"
                                      : "text-amber-500"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-gray-900 font-semibold">
                                {task.progress || task.progress_tab || "-"}
                              </td>
                              <td className="py-3 px-4 text-gray-300">
                                <ChevronRight className="w-4 h-4" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden divide-y divide-gray-200">
                      {tasks.map((task: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 space-y-2 cursor-pointer active:bg-gray-50"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#003A47] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {getInitials(task.staff_name)}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {task.staff_name}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div>
                              <span className="text-gray-400">Task: </span>
                              <span className="text-gray-700">
                                {task.task || task.title}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Date: </span>
                              <span className="text-gray-600">
                                {task.date_submitted || task.date}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">
                                Completion:{" "}
                              </span>
                              <span className="text-gray-600">
                                {formatDate(task.completion_date)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Status: </span>
                              <span
                                className={`font-semibold ${
                                  task.status === "Completed" ||
                                  task.status === "completed"
                                    ? "text-green-600"
                                    : "text-amber-500"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Progress: </span>
                              <span className="text-gray-900 font-semibold">
                                {task.progress || task.progress_tab || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}
          </main>
        </div>

        {selectedTask && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-20"
              onClick={() => setSelectedTask(null)}
            />
            <div className="fixed inset-0 md:top-0 md:right-0 md:inset-auto h-full w-full md:max-w-[500px] bg-white shadow-xl z-40 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 text-gray-400 text-sm font-medium">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
                <span>Submitted on {formatDate(selectedTask.completion_date)}</span>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
                    <ListTodo className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      Project title: {selectedTask.task || selectedTask.title}
                    </span>
                  </div>
                  <div className="border border-[#4CAF50] bg-[#E8F5E9]/30 text-[#4CAF50] rounded-lg px-3 py-2 text-sm font-semibold">
                    {selectedTask.progress || selectedTask.progress_tab || "-"}{" "}
                    Progress
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Task description
                  </h3>
                  <div className="w-full min-h-[90px] border border-gray-200 rounded-xl p-4 text-sm text-gray-800 bg-white leading-relaxed">
                    {(selectedTask.task || selectedTask.title) &&
                      `Create a ${selectedTask.task || selectedTask.title} for the task tracker project.`}
                  </div>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Assigned to</span>
                    </div>
                    <div className="w-48 flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                      <div className="w-6 h-6 rounded-full bg-[#5D5755] flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                        {getInitials(selectedTask.staff_name)}
                      </div>
                      <span className="text-xs font-semibold text-gray-800">
                        {selectedTask.staff_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <Circle className="w-4 h-4 text-gray-400" />
                      <span>Status</span>
                    </div>
                    <div className="w-48">
                      <div
                        className={`inline-block font-semibold text-xs px-3 py-2 rounded-lg border ${
                          selectedTask.status === "Completed" ||
                          selectedTask.status === "completed"
                            ? "border-[#4CAF50] bg-[#E8F5E9] text-[#4CAF50]"
                            : "border-[#FFD54F] bg-[#FFFDE7] text-[#D4AF37]"
                        }`}
                      >
                        {selectedTask.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <ListTodo className="w-4 h-4 text-gray-400" />
                      <span>Project name</span>
                    </div>
                    <div className="w-48 text-sm font-semibold text-gray-800">
                      {selectedTask.project || "Task Tracker Project"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Completion date</span>
                    </div>
                    <div className="w-48 text-sm font-semibold text-gray-800">
                      {formatDate(selectedTask.completion_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
