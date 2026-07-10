"use client";

import Link from "next/link";
import Card, { CardImage, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FiArrowRight } from "react-icons/fi";
import { getDifficultyColor, formatCategoryName } from "@/utils";

const FEATURED_PROJECTS = [
  {
    _id: "1",
    title: "E-Commerce Platform",
    shortDescription: "A full-stack e-commerce platform with payment integration and admin dashboard.",
    category: "web-development",
    difficulty: "intermediate",
    requiredSkills: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    image: "",
    owner: { name: "Sakib Rahman" },
  },
  {
    _id: "2",
    title: "AI Chatbot Assistant",
    shortDescription: "An intelligent chatbot powered by machine learning for customer support.",
    category: "ai-ml",
    difficulty: "advanced",
    requiredSkills: ["Python", "TensorFlow", "FastAPI", "React"],
    image: "",
    owner: { name: "Fatima Akter" },
  },
  {
    _id: "3",
    title: "Fitness Tracker App",
    shortDescription: "Cross-platform mobile app for tracking workouts and nutrition goals.",
    category: "mobile-development",
    difficulty: "beginner",
    requiredSkills: ["React Native", "Firebase", "TypeScript"],
    image: "",
    owner: { name: "Tanvir Hasan" },
  },
  {
    _id: "4",
    title: "DevOps Pipeline Tool",
    shortDescription: "Automated CI/CD pipeline management tool for modern development teams.",
    category: "devops",
    difficulty: "advanced",
    requiredSkills: ["Docker", "Kubernetes", "Node.js", "AWS"],
    image: "",
    owner: { name: "Nusrat Jahan" },
  },
  {
    _id: "5",
    title: "Portfolio Website Builder",
    shortDescription: "Drag-and-drop portfolio builder for developers and designers.",
    category: "web-development",
    difficulty: "beginner",
    requiredSkills: ["React", "Tailwind CSS", "Firebase"],
    image: "",
    owner: { name: "Rafiq Ahmed" },
  },
  {
    _id: "6",
    title: "Blockchain Voting System",
    shortDescription: "Decentralized voting application built on Ethereum for transparent elections.",
    category: "blockchain",
    difficulty: "advanced",
    requiredSkills: ["Solidity", "Web3.js", "React", "Node.js"],
    image: "",
    owner: { name: "Ayesha Siddique" },
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 max-w-xl">
              Discover the most popular projects looking for talented contributors.
              Find your next collaboration opportunity.
            </p>
          </div>
          <Link href="/explore" className="hidden sm:flex">
            <Button variant="outline" size="sm">
              View All
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <Card hover className="h-full flex flex-col">
                <CardImage src={project.image} alt={project.title} />
                <CardBody className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                      {formatCategoryName(project.category)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(
                        project.difficulty
                      )}`}
                    >
                      {project.difficulty.charAt(0).toUpperCase() +
                        project.difficulty.slice(1)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.requiredSkills.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                        +{project.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {(typeof project.owner === "object" ? project.owner.name : "")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs text-gray-500">
                        {typeof project.owner === "object" ? project.owner.name : ""}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-indigo-600 flex items-center gap-1">
                      View
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore">
            <Button variant="outline">
              View All Projects
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
