"use client";
import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex gap-4 mb-8 bg-paper p-4 border-2 border-ink shadow-sm flex-wrap items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="font-bold text-sm block mb-1">Busca</label>
        <Input name="search" defaultValue={searchParams.get('search') || ''} placeholder="Buscar..." />
      </div>
      <div className="w-[180px]">
        <label className="font-bold text-sm block mb-1">Categoria</label>
        <Select name="category" defaultValue={searchParams.get('category') || ''}>
          <option value="">Todas</option>
          <option value="TI">TI</option>
          <option value="RH">RH</option>
          <option value="COMPRAS">Compras</option>
          <option value="FINANCEIRO">Financeiro</option>
          <option value="INFRAESTRUTURA">Infraestrutura</option>
        </Select>
      </div>
      <div className="w-[180px]">
        <label className="font-bold text-sm block mb-1">Status</label>
        <Select name="status" defaultValue={searchParams.get('status') || ''}>
          <option value="">Todos</option>
          <option value="OPEN">Aberto</option>
          <option value="IN_PROGRESS">Em Atendimento</option>
          <option value="DONE">Concluído</option>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Filtrar</Button>
        <Button type="button" variant="outline" onClick={clearFilters}>Limpar</Button>
      </div>
    </form>
  );
}
