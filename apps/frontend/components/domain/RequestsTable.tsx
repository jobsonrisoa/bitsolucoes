"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/Table";
import { StatusBadge } from "./StatusBadge";
import { CategoryTag } from "./CategoryTag";
import { RequestItem, PaginatedResponse } from "@/lib/api/types";
import { Button } from "../ui/Button";
import { Tooltip } from "../ui/Tooltip";

type SortField = "id" | "title" | "category" | "requesterId" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

interface Props {
  data: PaginatedResponse<RequestItem>;
  onPageChange: (page: number) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
}

const columns: { field: SortField; label: string }[] = [
  { field: "id", label: "Código" },
  { field: "title", label: "Título" },
  { field: "category", label: "Categoria" },
  { field: "requesterId", label: "Solicitante" },
  { field: "createdAt", label: "Data de abertura" },
  { field: "status", label: "Status" },
];

export function RequestsTable({ data, onPageChange, onSortChange, sortBy, sortOrder }: Props) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (tbodyRef.current && data.data.length > 0) {
      const rows = tbodyRef.current.children;
      gsap.fromTo(rows, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [data.data]);

  const page = data.page ?? data.meta?.page ?? 1;
  const total = data.total ?? data.meta?.total ?? 0;
  const pageSize = data.pageSize ?? data.meta?.limit ?? 10;
  const totalPages = data.meta?.totalPages ?? (Math.ceil(total / pageSize) || 1);
  const formatId = (id: string) => id.startsWith('SOL-') ? id : `SOL-${id.padStart(6, '0')}`;
  const SortIcon = sortOrder === 'asc' ? ChevronUp : ChevronDown;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.field} aria-sort={sortBy === column.field ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button
                  type="button"
                  onClick={() => onSortChange(column.field)}
                  title={`Ordenar por ${column.label}`}
                  className="inline-flex h-10 items-center gap-1 font-archivo hover:underline hover:decoration-2 hover:underline-offset-4"
                >
                  {column.label}
                  {sortBy === column.field ? (
                    <SortIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-35" aria-hidden="true" />
                  )}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody ref={tbodyRef}>
          {data.data.map(req => (
            <TableRow key={req.id} className="cursor-pointer group relative">
              <TableCell className="font-ibm">
                <Link href={`/lista/${req.id}`} className="absolute inset-0 z-10" aria-label={`Abrir solicitação ${formatId(req.id)}: ${req.title}`} />
                {formatId(req.id)}
              </TableCell>
              <TableCell className="font-bold group-hover:underline">{req.title}</TableCell>
              <TableCell><CategoryTag category={req.category} /></TableCell>
              <TableCell>{req.requesterId ?? '-'}</TableCell>
              <TableCell>{new Date(req.createdAt).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell><StatusBadge status={req.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center bg-paper border-2 border-ink p-4">
        <span className="font-bold">Página {page} de {totalPages}</span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Tooltip label="Página anterior">
              <Button variant="outline" onClick={() => onPageChange(page - 1)} aria-label="Página anterior" title="Página anterior">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Tooltip>
          ) : null}
          {page < totalPages ? (
            <Tooltip label="Próxima página">
              <Button variant="outline" onClick={() => onPageChange(page + 1)} aria-label="Próxima página" title="Próxima página">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
}
