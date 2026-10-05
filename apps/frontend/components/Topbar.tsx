"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "./ui/Icon";
import { Tooltip } from "./ui/Tooltip";
import { cn } from "@/lib/utils";
import { Mark } from "./svg/Mark";
import { Skeleton } from "./ui/Skeleton";

export function Topbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const currentUser = user;
  const isAuthenticated = Boolean(currentUser);

  return (
    <header className="sticky top-0 z-40 flex min-h-16 w-full flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-2 bg-paper shadow-sm md:px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-black font-archivo tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm">
          <Mark className="h-8 w-8 text-red" />
          <span>Átrio</span>
        </Link>
        <nav className="hidden gap-6 font-bold md:flex">
          {isAuthenticated ? (
            <>
              <Tooltip label="Ir para o painel (g + 1)">
                <Link
                  href="/painel"
                  title="Ir para o painel"
                  tabIndex={0}
                  className={cn(
                    "hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm",
                    (pathname.startsWith('/painel') || pathname.startsWith('/dashboard')) && "text-blue underline decoration-2 underline-offset-4",
                  )}
                >
                  Painel
                </Link>
              </Tooltip>
              <Tooltip label="Abrir lista de solicitações (g + 2)">
                <Link
                  href="/lista"
                  title="Abrir lista de solicitações"
                  tabIndex={0}
                  className={cn("hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm", pathname.startsWith('/lista') && "text-blue underline decoration-2 underline-offset-4")}
                >
                  Solicitações
                </Link>
              </Tooltip>
            </>
          ) : null}
          <Tooltip label="Abrir manual da marca (g + 4)">
            <Link
              href="/manual-da-marca"
              title="Abrir manual da marca"
              tabIndex={0}
              className={cn(
                "hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm",
                (pathname.startsWith('/manual-da-marca') || pathname.startsWith('/brandbook')) && "text-blue underline decoration-2 underline-offset-4",
              )}
            >
              Manual da marca
            </Link>
          </Tooltip>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="font-bold hidden md:inline">{currentUser?.name ?? currentUser?.username}</span>
            <Tooltip label="Encerrar sessão">
              <button onClick={logout} className="flex items-center gap-2 border-2 border-ink rounded-sm px-3 py-2 font-bold hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink" aria-label="Sair" title="Sair">
                <Icon name="log-out" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </Tooltip>
          </div>
        ) : isLoading ? (
          <Skeleton className="h-6 w-16" />
        ) : (
          <Tooltip label="Entrar no Átrio">
            <Link href="/login" title="Entrar no Átrio" tabIndex={0} className="font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm">Login</Link>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
