"use client";

import Link from "next/link";
import { BookOpen, LayoutDashboard, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function HomeActions() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = Boolean(user);
  const primaryHref = isAuthenticated ? "/painel" : "/login";
  const primaryLabel = isAuthenticated ? "Ir para o painel" : "Entrar";
  const PrimaryIcon = isAuthenticated ? LayoutDashboard : LogIn;

  return (
    <div className="mt-4 sm:mt-8 flex flex-col gap-2 sm:flex-row sm:gap-3" role="group" aria-label="Ações principais">
      <Link
        href={primaryHref}
        aria-disabled={isLoading}
        tabIndex={0}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm border-2 border-ink bg-ink px-6 py-2 text-sm font-medium text-paper shadow-sm transition-colors active:translate-y-1 active:shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-60 sm:h-11 sm:w-auto sm:px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <PrimaryIcon className="h-4 w-4" />
        {isLoading ? "Carregando..." : primaryLabel}
      </Link>
      <Link
        href="/manual-da-marca"
        tabIndex={0}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm border-2 border-ink bg-paper px-6 py-2 text-sm font-medium text-ink shadow-sm transition-colors active:translate-y-1 active:shadow-none sm:h-11 sm:w-auto sm:px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <BookOpen className="h-4 w-4" />
        Ver manual da marca
      </Link>
    </div>
  );
}
