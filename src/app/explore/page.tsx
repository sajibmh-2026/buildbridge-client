"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Card, { CardImage, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import { projectService } from "@/services/projectService";
import { CATEGORIES, DIFFICULTIES, POPULAR_SKILLS } from "@/constants";
import { IProject, ProjectCategory, ProjectDifficulty, ProjectStatus } from "@/types";
import {
  formatDate,
  truncateText,
  getDifficultyColor,
  getCategoryIcon,
  formatCategoryName,
} from "@/utils";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get("skills")?.split(",").filter(Boolean) || []
  );
  const page = parseInt(searchParams.get("page") || "1");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects({
        search: search || undefined,
        category: (category as ProjectCategory) || undefined,
        difficulty: (difficulty as ProjectDifficulty) || undefined,
        status: (status as ProjectStatus) || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        sort: sort as "newest" | "oldest" | "title-asc" | "title-desc",
        page,
        limit: 9,
      });

      if (response.success) {
        setProjects(response.data || []);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [search, category, difficulty, status, sort, selectedSkills, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    newParams.delete("page"); // Reset page on filter change
    router.push(`/explore?${newParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setStatus("");
    setSelectedSkills([]);
    setSort("newest");
    router.push("/explore");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const hasActiveFilters = search || category || difficulty || status || selectedSkills.length > 0;

  return (
    <Layout>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore Projects</h1>
          <p className="text-indigo-100 text-lg mb-6">
            Discover {total}+ open projects and find your next collaboration
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiFilter className="w-4 h-4" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    updateURL({ category: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    updateURL({ difficulty: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Levels</option>
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    updateURL({ status: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="open">🟢 Open</option>
                  <option value="in-progress">🟡 In Progress</option>
                  <option value="completed">✅ Completed</option>
                  <option value="closed">🔴 Closed</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILLS.slice(0, 12).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        toggleSkill(skill);
                        const newSkills = selectedSkills.includes(skill)
                          ? selectedSkills.filter((s) => s !== skill)
                          : [...selectedSkills, skill];
                        updateURL({ skills: newSkills.join(",") });
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        selectedSkills.includes(skill)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{projects.length}</span> of{" "}
                <span className="font-semibold">{total}</span> projects
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    updateURL({ sort: e.target.value });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    Search: {search}
                    <button onClick={() => { setSearch(""); updateURL({ search: "" }); }} className="cursor-pointer">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                    {formatCategoryName(category)}
                    <button onClick={() => { setCategory(""); updateURL({ category: "" }); }} className="cursor-pointer">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {difficulty && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm capitalize">
                    {difficulty}
                    <button onClick={() => { setDifficulty(""); updateURL({ difficulty: "" }); }} className="cursor-pointer">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Projects Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project._id}`}>
                    <Card hover className="h-full">
                      <CardImage
                        src={project.image || ""}
                        alt={project.title}
                      />
                      <CardBody>
                        {/* Category + Difficulty */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {getCategoryIcon(project.category)}{" "}
                            {formatCategoryName(project.category)}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                              project.difficulty
                            )}`}
                          >
                            {project.difficulty}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {truncateText(project.shortDescription, 100)}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.requiredSkills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.requiredSkills.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{project.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3.5 h-3.5" />
                            {project.currentMembers}/{project.maxMembers || "∞"} members
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {formatDate(project.createdAt)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (page - 1).toString());
                    router.push(`/explore?${params.toString()}`);
                  }}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("page", pageNum.toString());
                        router.push(`/explore?${params.toString()}`);
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        pageNum === page
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (page + 1).toString());
                    router.push(`/explore?${params.toString()}`);
                  }}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        </Layout>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
