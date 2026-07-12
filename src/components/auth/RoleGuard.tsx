"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { FiShield, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FiShield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-2 max-w-md">
          You don&apos;t have permission to view this page.
          {user && (
            <span className="block text-sm text-gray-500 mt-1">
              Your role: <span className="font-medium capitalize">{user.role}</span> —
              Required: <span className="font-medium capitalize">{allowedRoles.join(" or ")}</span>
            </span>
          )}
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Inline role badge — shows "Admin" badge next to content
 */
export function AdminBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
      <FiShield className="w-3 h-3" />
      Admin
    </span>
  );
}

/**
 * Warning banner for admin-only sections
 */
export function AdminSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
        <FiAlertTriangle className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <AdminBadge />
        </div>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
