export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-700";
    case "intermediate":
      return "bg-yellow-100 text-yellow-700";
    case "advanced":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "web-development": "🌐",
    "mobile-development": "📱",
    "ai-ml": "🤖",
    devops: "⚙️",
    blockchain: "🔗",
    "game-development": "🎮",
    "data-science": "📊",
    cybersecurity: "🔒",
    "ui-ux": "🎨",
    other: "📦",
  };
  return icons[category] || "📦";
}

export function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
