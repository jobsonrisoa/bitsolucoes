"use client";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/domain/EmptyState";
import { RequestsTable } from "@/components/domain/RequestsTable";
import { RequestsListSkeleton } from "@/components/domain/PageSkeletons";
import { fetchApi } from "@/lib/api/client";
import { Category, PaginatedResponse, RequestItem } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SortField = "id" | "title" | "category" | "requesterId" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

const categories: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "TI", label: "TI" },
  { value: "RH", label: "RH" },
  { value: "COMPRAS", label: "Compras" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "INFRAESTRUTURA", label: "Infraestrutura" },
];

export default function Lista() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<PaginatedResponse<RequestItem> | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      if (isAuthLoading || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
          sortBy,
          sortOrder,
        });
        if (query.trim()) params.set("q", query.trim());
        if (category !== "ALL") params.set("category", category);
        const response = await fetchApi(`/requests?${params.toString()}`);
        if (isMounted) setData(response);
      } catch {
        if (isMounted) setError("Não foi possível carregar as solicitações.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [category, isAuthLoading, page, query, sortBy, sortOrder, user]);

  const handleCategoryChange = (nextCategory: Category | "ALL") => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const handleSortChange = (field: SortField) => {
    setPage(1);
    if (field === sortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortOrder(field === "createdAt" || field === "id" ? "desc" : "asc");
  };

  if (isAuthLoading || !user || (isLoading && !data)) return <RequestsListSkeleton />;

  return (
    <div className="p-8" aria-busy={isLoading}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black font-archivo">Solicitações</h1>
        <Link href="/lista/nova" title="Criar nova solicitação">
          <Button>Nova Solicitação</Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-4">
        <label className="grid max-w-xl gap-2 text-sm font-bold" htmlFor="requests-search">
          Buscar por título
          <input
            id="requests-search"
            name="search"
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Digite para buscar"
            className="h-11 rounded-sm border-2 border-ink bg-paper px-3 text-base font-normal text-ink"
          />
        </label>

        <div className="flex flex-wrap gap-2" aria-label="Filtrar por tipo de solicitação">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleCategoryChange(item.value)}
              aria-pressed={category === item.value}
              title={`Filtrar por ${item.label.toLowerCase()}`}
              className={cn(
                "rounded-sm border-2 border-ink bg-paper px-3 py-2 text-sm font-bold shadow-sm transition-colors hover:bg-bg",
                category === item.value && "bg-ink text-paper hover:bg-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="font-bold text-red-700">{error}</p> : null}
      {!isLoading && !error && data?.data.length === 0 ? <EmptyState /> : null}
      {!error && data && data.data.length > 0 ? (
        <RequestsTable
          data={data}
          onPageChange={setPage}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : null}
    </div>
  );
}
