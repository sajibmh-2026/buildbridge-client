"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { projectService } from "@/services/projectService";
import { CATEGORIES, DIFFICULTIES, POPULAR_SKILLS } from "@/constants";
import { ProjectCategory, ProjectDifficulty } from "@/types";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiX,
  FiImage,
} from "react-icons/fi";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const projectId = params.id as string;

  // Form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("web-development");
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>("beginner");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [image, setImage] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [deadline, setDeadline] = useState("");
  const [repository, setRepository] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const fetchProject = useCallback(async () => {
    try {
      const response = await projectService.getProject(projectId);
      if (response.success && response.data) {
        const p = response.data;
        const ownerId = typeof p.owner === "object" ? p.owner._id : p.owner;

        if (user && user._id !== ownerId) {
          toast.error("You are not authorized to edit this project");
          router.push(`/projects/${projectId}`);
          return;
        }

        setTitle(p.title);
        setShortDescription(p.shortDescription);
        setDescription(p.description);
        setCategory(p.category);
        setDifficulty(p.difficulty);
        setRequiredSkills(p.requiredSkills);
        setImage(p.image || "");
        setMaxMembers(p.maxMembers || 5);
        setDeadline(p.deadline ? p.deadline.split("T")[0] : "");
        setRepository(p.repository || "");
        setLiveUrl(p.liveUrl || "");
        setTags(p.tags || []);
      } else {
        toast.error("Project not found");
        router.push("/explore");
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, user, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProject();
  }, [isAuthenticated, fetchProject, router]);

  const addSkill = (skill: string) => {
    if (skill && !requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (requiredSkills.length === 0) {
      toast.error("At least one skill is required");
      return;
    }

    setSaving(true);
    try {
      const response = await projectService.updateProject(projectId, {
        title,
        shortDescription,
        description,
        category,
        difficulty,
        requiredSkills,
        image: image || undefined,
        maxMembers,
        deadline: deadline || undefined,
        repository: repository || undefined,
        liveUrl: liveUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      if (response.success) {
        toast.success("Project updated successfully!");
        router.push(`/projects/${projectId}`);
      } else {
        toast.error(response.error || "Failed to update project");
      }
    } catch {
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
          <p className="text-gray-600 mb-8">Update your project details</p>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-5">
              <Input
                id="title"
                label="Project Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all cursor-pointer ${
                        category === cat.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setDifficulty(diff.value)}
                      className={`p-3 rounded-lg border text-sm font-medium text-center transition-all cursor-pointer ${
                        difficulty === diff.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {POPULAR_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        requiredSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        requiredSkills.includes(skill)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(customSkill);
                        setCustomSkill("");
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addSkill(customSkill);
                      setCustomSkill("");
                    }}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="cursor-pointer">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project Image URL
                </label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="maxMembers"
                  label="Max Team Members"
                  type="number"
                  min={1}
                  max={20}
                  value={maxMembers.toString()}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 5)}
                />
                <Input
                  id="deadline"
                  label="Deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="repository"
                  label="GitHub Repository"
                  type="url"
                  placeholder="https://github.com/..."
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                />
                <Input
                  id="liveUrl"
                  label="Live Demo URL"
                  type="url"
                  placeholder="https://..."
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(customTag);
                        setCustomTag("");
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addTag(customTag);
                      setCustomTag("");
                    }}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button type="submit" loading={saving} size="lg">
                  <FiSave className="mr-2 w-4 h-4" /> Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(`/projects/${projectId}`)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
