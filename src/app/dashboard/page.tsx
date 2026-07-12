"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import {
  IDashboardData,
  IAdminDashboardData,
  IProject,
  IApplication,
} from "@/types";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  CategoryChart,
  DifficultyChart,
  ApplicationStatusChart,
  MonthlyActivityChart,
} from "@/components/charts";
import RoleGuard, { AdminBadge, AdminSectionHeader } from "@/components/auth/RoleGuard";
import {
  FiFolder,
  FiSend,
  FiClock,
  FiCheck,
  FiXCircle,
  FiPlus,
  FiExternalLink,
  FiUsers,
  FiTrendingUp,
  FiBarChart2,
  FiChevronRight,
} from "react-icons/fi";
import { cn, formatDate, getDifficultyColor } from "@/utils";

type TabKey = "overview" | "projects" | "applications" | "admin";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
  const [adminData, setAdminData] = useState<IAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    if (user?.role !== "admin") return;
    try {
      setAdminLoading(true);
      const response = await dashboardService.getAdminStats();
      if (response.success && response.data) {
        setAdminData(response.data);
      }
    } catch {
      console.error("Failed to load admin data");
    } finally {
      setAdminLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeTab === "admin" && !adminData) {
      fetchAdminData();
    }
  }, [activeTab, adminData, fetchAdminData]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { key: "overview", label: "Overview", icon: <FiBarChart2 className="w-4 h-4" /> },
    { key: "projects", label: "My Projects", icon: <FiFolder className="w-4 h-4" /> },
    { key: "applications", label: "Applications", icon: <FiSend className="w-4 h-4" /> },
    {
      key: "admin",
      label: "Admin Panel",
      icon: <FiUsers className="w-4 h-4" />,
      adminOnly: true,
    },
  ];

  const visibleTabs = tabs.filter((tab) => !tab.adminOnly || user?.role === "admin");

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchDashboard} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(" ")[0]}!
                </h1>
                {user?.role === "admin" && <AdminBadge />}
              </div>
              <p className="text-gray-500 mt-1">
                Here&apos;s what&apos;s happening with your projects
              </p>
            </div>
            <Link href="/projects/add">
              <Button variant="primary" size="md">
                <FiPlus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.adminOnly && <AdminBadge />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && stats && dashboardData && (
          <OverviewTab stats={stats} dashboardData={dashboardData} />
        )}

        {activeTab === "projects" && dashboardData && (
          <ProjectsTab projects={dashboardData.projects} />
        )}

        {activeTab === "applications" && dashboardData && (
          <ApplicationsTab applications={dashboardData.applications} />
        )}

        {activeTab === "admin" && user?.role === "admin" && (
          <RoleGuard allowedRoles={["admin"]}>
            <AdminTab data={adminData} loading={adminLoading} />
          </RoleGuard>
        )}
      </div>
    </div>
  );
}

/* ───────────────────── Overview Tab ───────────────────── */
function OverviewTab({
  stats,
  dashboardData,
}: {
  stats: IDashboardData["stats"];
  dashboardData: IDashboardData;
}) {
  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: <FiFolder className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: <FiSend className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects ?? 0,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending Requests",
      value: stats.applicationStatusCounts.pending,
      icon: <FiClock className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Accepted",
      value: stats.applicationStatusCounts.accepted,
      icon: <FiCheck className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Rejected",
      value: stats.applicationStatusCounts.rejected,
      icon: <FiXCircle className="w-6 h-6" />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardBody className="text-center py-6">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                  card.color
                )}
              >
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects by Category
            </h3>
            <CategoryChart data={dashboardData.charts.categoryStats} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Difficulty Distribution
            </h3>
            <DifficultyChart data={dashboardData.charts.difficultyStats} />
          </CardBody>
        </Card>
      </div>

      {/* Application Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Application Status
            </h3>
            <ApplicationStatusChart data={stats.applicationStatusCounts} />
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {dashboardData.applications.slice(0, 5).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      app.status === "accepted"
                        ? "bg-green-100 text-green-600"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                    )}
                  >
                    {app.status === "accepted" ? (
                      <FiCheck className="w-4 h-4" />
                    ) : app.status === "rejected" ? (
                      <FiXCircle className="w-4 h-4" />
                    ) : (
                      <FiClock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {typeof app.projectId === "object" && app.projectId !== null
                        ? (app.projectId as { title?: string }).title || "Project"
                        : "Project"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full capitalize",
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
              {dashboardData.applications.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  No applications yet.{" "}
                  <Link href="/explore" className="text-indigo-600 hover:underline">
                    Explore projects
                  </Link>
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────── Projects Tab ───────────────────── */
function ProjectsTab({ projects }: { projects: IProject[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          My Projects ({projects.length})
        </h2>
        <Link href="/projects/add">
          <Button variant="primary" size="sm">
            <FiPlus className="w-4 h-4 mr-1" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardBody className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFolder className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first project to start collaborating!
            </p>
            <Link href="/projects/add">
              <Button variant="primary">Create Project</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project._id} hover>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {project.title}
                      </h3>
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
                          project.status === "open"
                            ? "bg-green-100 text-green-700"
                            : project.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : project.status === "completed"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {project.status}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-0.5 rounded-full",
                          getDifficultyColor(project.difficulty)
                        )}
                      >
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {project.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Created {formatDate(project.createdAt)}</span>
                      {project.maxMembers && (
                        <span>
                          {project.currentMembers || 0}/{project.maxMembers} members
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/projects/${project._id}`}>
                      <Button variant="ghost" size="sm">
                        <FiExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/projects/${project._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Applications Tab ───────────────────── */
function ApplicationsTab({ applications }: { applications: IApplication[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        My Applications ({applications.length})
      </h2>

      {applications.length === 0 ? (
        <Card>
          <CardBody className="text-center py-16">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSend className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 mb-6">
              Browse projects and apply to collaborate!
            </p>
            <Link href="/explore">
              <Button variant="secondary">Explore Projects</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {typeof app.projectId === "object" && app.projectId !== null
                          ? (app.projectId as { title?: string }).title || "Project"
                          : "Project"}
                      </h3>
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
                          app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {app.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Applied {formatDate(app.createdAt)}
                    </p>
                  </div>
                  {typeof app.projectId === "object" && app.projectId !== null && (
                    <Link href={`/projects/${(app.projectId as { _id?: string })._id}`}>
                      <Button variant="ghost" size="sm">
                        View Project
                        <FiChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Admin Tab ───────────────────── */
function AdminTab({
  data,
  loading,
}: {
  data: IAdminDashboardData | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load admin data
      </div>
    );
  }

  const adminStatCards = [
    {
      label: "Total Users",
      value: data.stats.totalUsers,
      icon: <FiUsers className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Total Projects",
      value: data.stats.totalProjects,
      icon: <FiFolder className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Applications",
      value: data.stats.totalApplications,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        title="Platform Analytics"
        description="Overview of BuildBridge platform activity"
      />

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminStatCards.map((card) => (
          <Card key={card.label}>
            <CardBody className="flex items-center gap-4 py-6">
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  card.color
                )}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Admin Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Growth
            </h3>
            <MonthlyActivityChart
              usersData={data.charts.monthlyUsers}
              projectsData={data.charts.monthlyProjects}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects by Category
            </h3>
            <CategoryChart data={data.charts.projectsByCategory} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects by Difficulty
            </h3>
            <DifficultyChart data={data.charts.projectsByDifficulty} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Applications by Status
            </h3>
            <ApplicationStatusChart
              data={{
                pending:
                  data.charts.applicationsByStatus.find((s) => s._id === "pending")
                    ?.count || 0,
                accepted:
                  data.charts.applicationsByStatus.find((s) => s._id === "accepted")
                    ?.count || 0,
                rejected:
                  data.charts.applicationsByStatus.find((s) => s._id === "rejected")
                    ?.count || 0,
              }}
            />
          </CardBody>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                          u.role === "admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Projects
          </h3>
          <div className="space-y-3">
            {data.recentProjects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {project.title}
                    </p>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                        project.status === "open"
                          ? "bg-green-100 text-green-700"
                          : project.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created {formatDate(project.createdAt)}
                  </p>
                </div>
                <Link href={`/projects/${project._id}`}>
                  <FiExternalLink className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                </Link>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ───────────────────── Dashboard Skeleton ───────────────────── */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-100 rounded" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
