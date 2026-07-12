"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { dashboardService } from "@/services/dashboardService";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { cn, getInitials } from "@/utils";
import { POPULAR_SKILLS } from "@/constants";
import { toast } from "sonner";
import Image from "next/image";
import {
  FiUser,
  FiEdit3,
  FiSave,
  FiX,
  FiMapPin,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCalendar,
  FiFolder,
  FiSend,
  FiCheck,
} from "react-icons/fi";

interface ProfileStats {
  projects: number;
  applicationsSent: number;
  applicationsReceived: number;
  accepted: number;
}

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    photo: "",
    skills: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        photo: user.photo || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardService.getStats();
        if (res.success && res.data) {
          setStats({
            projects: res.data.stats.totalProjects,
            applicationsSent: res.data.stats.totalApplications,
            applicationsReceived: res.data.stats.totalApplicationsReceived,
            accepted: res.data.stats.applicationStatusCounts.accepted,
          });
        }
      } catch {
        // Silent
      }
    }
    if (user) fetchStats();
  }, [user]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await authService.updateProfile(form);
      if (res.success) {
        toast.success("Profile updated successfully!");
        await loadUser();
        setEditing(false);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  if (!user) {
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
      {/* Hero Banner */}
      <section className="bg-linear-to-br from-indigo-600 via-indigo-700 to-emerald-600 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name}
                  width={112}
                  height={112}
                  className="rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  priority
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white/20 border-4 border-white/20 shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
              )}
              {user.role === "admin" && (
                <span className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                  ADMIN
                </span>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-indigo-200 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <FiMail className="w-4 h-4" /> {user.email}
              </p>
              {user.location && (
                <p className="text-indigo-200 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <FiMapPin className="w-4 h-4" /> {user.location}
                </p>
              )}
              {user.bio && (
                <p className="text-indigo-100 mt-3 max-w-xl text-sm leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            {!editing && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <FiEdit3 className="mr-2 w-4 h-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Projects", value: stats.projects, icon: <FiFolder className="w-5 h-5" />, color: "bg-indigo-100 text-indigo-600" },
              { label: "Sent", value: stats.applicationsSent, icon: <FiSend className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-600" },
              { label: "Received", value: stats.applicationsReceived, icon: <FiCalendar className="w-5 h-5" />, color: "bg-amber-100 text-amber-600" },
              { label: "Accepted", value: stats.accepted, icon: <FiCheck className="w-5 h-5" />, color: "bg-green-100 text-green-600" },
            ].map((s) => (
              <Card key={s.label}>
                <CardBody className="text-center py-5">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", s.color)}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {editing ? (
          /* ─── Edit Mode ─── */
          <Card>
            <CardBody className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <FiX className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell others about yourself..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiGlobe className="inline w-3.5 h-3.5 mr-1" /> Website
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiGithub className="inline w-3.5 h-3.5 mr-1" /> GitHub
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiLinkedin className="inline w-3.5 h-3.5 mr-1" /> LinkedIn
                  </label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Skills Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer",
                        form.skills.includes(skill)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} loading={saving}>
                  <FiSave className="mr-2 w-4 h-4" /> Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          /* ─── View Mode ─── */
          <div className="space-y-6">
            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <Card>
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Links */}
            {(user.website || user.github || user.linkedin) && (
              <Card>
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <FiGlobe className="w-4 h-4" /> Website
                      </a>
                    )}
                    {user.github && (
                      <a
                        href={user.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <FiGithub className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {user.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <FiLinkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* No profile data hint */}
            {!user.bio && (!user.skills || user.skills.length === 0) && !user.website && !user.github && !user.linkedin && (
              <Card>
                <CardBody className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Complete your profile
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Add your bio, skills, and social links so other developers can find and connect with you.
                  </p>
                  <Button onClick={() => setEditing(true)}>
                    <FiEdit3 className="mr-2 w-4 h-4" /> Edit Profile
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
