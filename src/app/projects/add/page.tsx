"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  FiArrowRight,
  FiCheck,
  FiPlus,
  FiX,
  FiImage,
} from "react-icons/fi";

const STEPS = ["Basic Info", "Details", "Skills & Settings"];

export default function AddProjectPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const canNext = () => {
    if (step === 1) return title.trim().length >= 3 && shortDescription.trim().length >= 10 && description.trim().length >= 20;
    if (step === 2) return requiredSkills.length > 0;
    return true;
  };

  const stepErrors = () => {
    if (step !== 1) return null;
    const errors: string[] = [];
    if (title.trim().length > 0 && title.trim().length < 3) errors.push("Title needs at least 3 characters");
    if (shortDescription.trim().length > 0 && shortDescription.trim().length < 10) errors.push("Short description needs at least 10 characters");
    if (description.trim().length > 0 && description.trim().length < 20) errors.push("Full description needs at least 20 characters");
    return errors.length > 0 ? errors : null;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to create a project");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await projectService.createProject({
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

      if (response.success && response.data) {
        toast.success("Project created successfully!");
        router.push(`/projects/${response.data._id}`);
      } else {
        toast.error(response.error || "Failed to create project");
      }
    } catch {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600 mb-8">
            Fill in the details to create your project and find collaborators
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 < step
                      ? "bg-emerald-600 text-white"
                      : i + 1 === step
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1 < step ? <FiCheck className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    i + 1 === step ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <Input
                  id="title"
                  label="Project Title *"
                  placeholder="e.g. E-Commerce Platform with AI Recommendations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title.trim().length > 0 && title.trim().length < 3 && (
                  <p className="text-xs text-red-500 -mt-3">Minimum 3 characters ({title.trim().length}/3)</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    placeholder="A brief one-liner about your project (max 200 chars)"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    maxLength={200}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">{shortDescription.length}/200</p>
                  {shortDescription.trim().length > 0 && shortDescription.trim().length < 10 && (
                    <p className="text-xs text-red-500">Minimum 10 characters ({shortDescription.trim().length}/10)</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Description *
                  </label>
                  <textarea
                    placeholder="Describe your project in detail — goals, tech stack, what you're building..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{description.length} characters (min 20)</p>
                  {description.trim().length > 0 && description.trim().length < 20 && (
                    <p className="text-xs text-red-500">Minimum 20 characters ({description.trim().length}/20)</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Project Image URL
                  </label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      placeholder="https://example.com/project-image.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Category & Skills */}
            {step === 2 && (
              <div className="space-y-5">
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
                          requiredSkills.includes(skill)
                            ? removeSkill(skill)
                            : addSkill(skill)
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
                          <button onClick={() => removeSkill(skill)} className="cursor-pointer">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Settings */}
            {step === 3 && (
              <div className="space-y-5">
                <Input
                  id="maxMembers"
                  label="Maximum Team Members"
                  type="number"
                  min={1}
                  max={20}
                  value={maxMembers.toString()}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 5)}
                />

                <Input
                  id="deadline"
                  label="Project Deadline (Optional)"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />

                <Input
                  id="repository"
                  label="GitHub Repository (Optional)"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                />

                <Input
                  id="liveUrl"
                  label="Live Demo URL (Optional)"
                  type="url"
                  placeholder="https://yourproject.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tags (Optional)
                  </label>
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
                          <button onClick={() => removeTag(tag)} className="cursor-pointer">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <FiArrowLeft className="mr-2 w-4 h-4" /> Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <div className="flex flex-col items-end gap-1">
                  {stepErrors() && (
                    <div className="text-xs text-red-500 text-right">
                      {stepErrors()!.map((err, i) => (
                        <p key={i}>⚠ {err}</p>
                      ))}
                    </div>
                  )}
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                    Next <FiArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSubmit} loading={loading} size="lg">
                  <FiCheck className="mr-2 w-4 h-4" /> Create Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
