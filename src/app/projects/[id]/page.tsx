"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { projectService } from "@/services/projectService";
import { applicationService } from "@/services/applicationService";
import { IProject } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import {
  formatDate,
  getDifficultyColor,
  getCategoryIcon,
  formatCategoryName,
  getInitials,
} from "@/utils";
import {
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiGithub,
  FiExternalLink,
  FiEdit3,
  FiTrash2,
  FiSend,
  FiClock,
  FiMapPin,
  FiGlobe,
  FiLinkedin,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<(IProject & { applicationCount?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [githubProfile, setGithubProfile] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState<IProject[]>([]);

  const projectId = params.id as string;

  const fetchProject = useCallback(async () => {
    try {
      const response = await projectService.getProject(projectId);
      if (response.success && response.data) {
        setProject(response.data as IProject & { applicationCount?: number });
      } else {
        toast.error("Project not found");
        router.push("/explore");
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  const checkApplication = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await applicationService.getApplications({});
      if (response.success && response.data) {
        const applied = response.data.some(
          (app) =>
            (typeof app.projectId === "string"
              ? app.projectId
              : app.projectId._id) === projectId
        );
        setHasApplied(applied);
      }
    } catch {
      // Silent fail
    }
  }, [isAuthenticated, user, projectId]);

  useEffect(() => {
    fetchProject();
    checkApplication();
  }, [fetchProject, checkApplication]);

  const fetchRelatedProjects = useCallback(async () => {
    if (!project?.category) return;
    try {
      const response = await projectService.getProjects({
        category: project.category,
        limit: 4,
      });
      if (response.success && response.data) {
        setRelatedProjects(
          response.data.filter((p) => p._id !== projectId).slice(0, 3)
        );
      }
    } catch {
      // Silent fail
    }
  }, [project?.category, projectId]);

  useEffect(() => {
    if (project) fetchRelatedProjects();
  }, [project, fetchRelatedProjects]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationMessage.trim()) {
      toast.error("Please write a message explaining why you want to join");
      return;
    }

    setApplying(true);
    try {
      const response = await applicationService.applyToProject({
        projectId,
        message: applicationMessage,
        githubProfile,
        portfolioUrl,
      });

      if (response.success) {
        toast.success("Application submitted successfully!");
        setShowApplyForm(false);
        setHasApplied(true);
        setApplicationMessage("");
      } else {
        toast.error(response.error || "Failed to submit application");
      }
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await projectService.deleteProject(projectId);
      if (response.success) {
        toast.success("Project deleted successfully");
        router.push("/explore");
      } else {
        toast.error(response.error || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  const owner =
    typeof project.owner === "object" ? project.owner : null;
  const isOwner = user && owner && user._id === owner._id;
  const isAdmin = user?.role === "admin";
  const canManage = isOwner || isAdmin;
  const isOpen = project.status === "open";
  const isFull =
    project.maxMembers &&
    project.currentMembers &&
    project.currentMembers >= project.maxMembers;

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-linear-to-br from-indigo-600 via-indigo-700 to-emerald-600 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-indigo-100 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium bg-white/20 text-white px-3 py-1 rounded-full">
                  {getCategoryIcon(project.category)}{" "}
                  {formatCategoryName(project.category)}
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${
                    project.status === "open"
                      ? "bg-emerald-400/20 text-emerald-100"
                      : project.status === "in-progress"
                      ? "bg-amber-400/20 text-amber-100"
                      : "bg-gray-400/20 text-gray-100"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {project.title}
              </h1>
              <p className="text-indigo-100 text-lg max-w-2xl">
                {project.shortDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {canManage ? (
                <>
                  <Link href={`/projects/${projectId}/edit`}>
                    <Button variant="secondary" size="sm">
                      <FiEdit3 className="mr-2 w-4 h-4" /> Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                    <FiTrash2 className="mr-2 w-4 h-4" /> Delete
                  </Button>
                </>
              ) : isAuthenticated && isOpen && !isFull && !hasApplied ? (
                <Button
                  onClick={() => setShowApplyForm(true)}
                  size="lg"
                >
                  <FiSend className="mr-2 w-4 h-4" /> Apply to Join
                </Button>
              ) : hasApplied ? (
                <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="font-medium">Already Applied</span>
                </div>
              ) : !isAuthenticated ? (
                <Link href="/login">
                  <Button size="lg">Login to Apply</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            {project.image && (
              <div className="relative rounded-xl overflow-hidden h-64 md:h-80">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Project
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Form Modal */}
            {showApplyForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Apply to Join
                  </h2>
                  <p className="text-sm text-gray-600 mb-5">
                    Tell the project owner why you&apos;d be a great fit
                  </p>

                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why do you want to join? *
                      </label>
                      <textarea
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        rows={4}
                        placeholder="Describe your experience, motivation, and what you can contribute..."
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={githubProfile}
                        onChange={(e) => setGithubProfile(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" loading={applying} className="flex-1">
                        <FiSend className="mr-2 w-4 h-4" /> Submit Application
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowApplyForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FiStar className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-500">Difficulty:</span>
                  <span
                    className={`font-medium px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiUsers className="w-4 h-4 text-indigo-500" />
                  <span className="text-gray-500">Members:</span>
                  <span className="font-medium text-gray-900">
                    {project.currentMembers || 1} / {project.maxMembers || "∞"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiClock className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-500">Posted:</span>
                  <span className="text-gray-900">{formatDate(project.createdAt)}</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiCalendar className="w-4 h-4 text-red-500" />
                    <span className="text-gray-500">Deadline:</span>
                    <span className="text-gray-900">{formatDate(project.deadline)}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <FiSend className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-500">Applications:</span>
                  <span className="font-medium text-gray-900">
                    {project.applicationCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            {(project.repository || project.liveUrl) && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
                <div className="space-y-2">
                  {project.repository && (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <FiGithub className="w-4 h-4" />
                      Repository
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <FiGlobe className="w-4 h-4" />
                      Live Demo
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Owner Info */}
            {owner && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Project Owner</h3>
                <div className="flex items-center gap-3 mb-3">
                  {owner.photo ? (
                    <Image
                      src={owner.photo}
                      alt={owner.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-indigo-600">
                        {getInitials(owner.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{owner.name}</p>
                    <p className="text-sm text-gray-500">{owner.email}</p>
                  </div>
                </div>
                {owner.bio && (
                  <p className="text-sm text-gray-600 mb-3">{owner.bio}</p>
                )}
                <div className="flex gap-2">
                  {owner.github && (
                    <a
                      href={owner.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <FiGithub className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {owner.linkedin && (
                    <a
                      href={owner.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <FiLinkedin className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {owner.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
                      <FiMapPin className="w-3.5 h-3.5" />
                      {owner.location}
                    </span>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rp) => (
              <Link key={rp._id} href={`/projects/${rp._id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {getCategoryIcon(rp.category)}{" "}
                      {formatCategoryName(rp.category)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                        rp.difficulty
                      )}`}
                    >
                      {rp.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {rp.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {rp.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rp.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and all applications will be removed."
        confirmLabel="Delete Project"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      />
    </Layout>
  );
}
