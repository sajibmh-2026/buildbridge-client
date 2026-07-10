import { ProjectCategory, ProjectDifficulty } from "@/types";

export const APP_NAME = "BuildBridge";
export const APP_DESCRIPTION = "Developer Collaboration Platform - Discover projects, recruit teammates, and build together.";

export const NAV_LINKS = {
  loggedOut: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
  ],
  loggedIn: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Add Project", href: "/projects/add" },
    { label: "Profile", href: "/profile" },
  ],
};

export const CATEGORIES: { value: ProjectCategory; label: string; icon: string }[] = [
  { value: "web-development", label: "Web Development", icon: "🌐" },
  { value: "mobile-development", label: "Mobile Development", icon: "📱" },
  { value: "ai-ml", label: "AI / ML", icon: "🤖" },
  { value: "devops", label: "DevOps", icon: "⚙️" },
  { value: "blockchain", label: "Blockchain", icon: "🔗" },
  { value: "game-development", label: "Game Development", icon: "🎮" },
  { value: "data-science", label: "Data Science", icon: "📊" },
  { value: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
  { value: "ui-ux", label: "UI/UX Design", icon: "🎨" },
  { value: "other", label: "Other", icon: "📦" },
];

export const DIFFICULTIES: { value: ProjectDifficulty; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "text-green-600 bg-green-50" },
  { value: "intermediate", label: "Intermediate", color: "text-yellow-600 bg-yellow-50" },
  { value: "advanced", label: "Advanced", color: "text-red-600 bg-red-50" },
];

export const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "GraphQL",
  "Firebase",
  "React Native",
  "Flutter",
  "Django",
  "Express.js",
  "Vue.js",
  "Angular",
  "Svelte",
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sakib Rahman",
    role: "Full Stack Developer",
    avatar: "",
    content:
      "BuildBridge helped me find the perfect team for my open-source project. Within a week, I had 3 talented developers collaborating with me!",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatima Akter",
    role: "UI/UX Designer",
    avatar: "",
    content:
      "As a designer, I always struggled to find developer teams that value design. BuildBridge connected me with amazing projects that appreciate great UX.",
    rating: 5,
  },
  {
    id: 3,
    name: "Tanvir Hasan",
    role: "Backend Developer",
    avatar: "",
    content:
      "The platform is clean, easy to use, and the project matching is spot on. I found my current startup co-founder through BuildBridge!",
    rating: 4,
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Mobile Developer",
    avatar: "",
    content:
      "I love how BuildBridge makes collaboration seamless. The skill-based matching saves so much time in finding the right teammates.",
    rating: 5,
  },
];

export const FAQS = [
  {
    question: "What is BuildBridge?",
    answer:
      "BuildBridge is a developer collaboration platform where you can discover projects, recruit teammates, and build amazing things together. It connects developers with complementary skills.",
  },
  {
    question: "Is BuildBridge free to use?",
    answer:
      "Yes! BuildBridge is completely free for developers. You can create projects, apply to join teams, and collaborate without any cost.",
  },
  {
    question: "How do I find teammates for my project?",
    answer:
      "Simply create a project listing with your required skills, and other developers can discover and apply to join your team. You can also browse and invite developers directly.",
  },
  {
    question: "What types of projects can I find?",
    answer:
      "BuildBridge covers all categories including web development, mobile apps, AI/ML, blockchain, game development, data science, cybersecurity, and more.",
  },
  {
    question: "How does the skill matching work?",
    answer:
      "Our platform matches developers based on their listed skills, project requirements, and preferences. This ensures you find teammates with the right expertise.",
  },
  {
    question: "Can I join multiple projects at once?",
    answer:
      "Absolutely! You can apply to and participate in multiple projects simultaneously, as long as you can commit the time needed for each.",
  },
];

export const STATS = [
  { label: "Active Projects", value: "500+", icon: "🚀" },
  { label: "Developers", value: "2,000+", icon: "👨‍💻" },
  { label: "Teams Formed", value: "350+", icon: "🤝" },
  { label: "Technologies", value: "50+", icon: "⚡" },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and showcase your skills, experience, and what you're looking for in a project.",
    icon: "👤",
  },
  {
    step: 2,
    title: "Discover Projects",
    description: "Browse through hundreds of projects or post your own. Filter by category, difficulty, and required skills.",
    icon: "🔍",
  },
  {
    step: 3,
    title: "Collaborate & Build",
    description: "Apply to projects, get accepted, and start building amazing things with your new team!",
    icon: "🚀",
  },
];

export const DEMO_CREDENTIALS = {
  user: {
    email: "user@buildbridge.com",
    password: "User1234!",
  },
  admin: {
    email: "admin@buildbridge.com",
    password: "Admin1234!",
  },
};
