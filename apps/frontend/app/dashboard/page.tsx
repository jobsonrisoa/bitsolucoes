"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/domain/StatCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchApi } from "@/lib/api/client";
import { DashboardSummary } from "@/lib/api/types";
import { DashboardSkeleton } from "@/components/domain/PageSkeletons";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading || !user) return;

    setIsLoading(true);
    setError(null);

    fetchApi("/dashboard/summary")
      .then(setSummary)
      .catch(() => setError("Não foi possível carregar o painel."))
      .finally(() => setIsLoading(false));
  }, [isAuthLoading, user]);

  if (isAuthLoading || !user || isLoading) return <DashboardSkeleton />;

  const total = summary?.total ?? 0;
  const open = summary?.open ?? 0;
  const inProgress = summary?.inProgress ?? 0;
  const done = summary?.done ?? summary?.completed ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 border-2 border-ink bg-band-bg p-6 pb-0 text-band-text">
        <h1 className="font-archivo text-4xl leading-none md:text-5xl">Painel</h1>
        <p className="mt-3 max-w-2xl text-band-text/80">
          Visão geral das solicitações internas, com totais atualizados após cada registro.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 pb-6 md:grid-cols-4">
          <StatCard label="Total" value={total} colorVar="--ink" />
          <StatCard label="Abertas" value={open} colorVar="--blue" />
          <StatCard label="Em Atendimento" value={inProgress} colorVar="--terra" />
          <StatCard label="Concluídas" value={done} colorVar="--moss" />
        </div>
        <div className="-mx-6 h-10 azulejo" aria-hidden="true" />
      </div>
      {error ? <p className="mb-6 font-bold text-red-700">{error}</p> : null}
      <Card className="p-6">
        <h2 className="mb-2 font-archivo text-xl">Nenhuma pendência crítica hoje</h2>
        <p className="mb-5 max-w-2xl text-muted">
          Abra a lista para consultar solicitações ou registre uma nova demanda.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/lista/nova"><Button>Nova solicitação</Button></Link>
          <Link href="/lista"><Button variant="outline">Ver lista</Button></Link>
        </div>
      </Card>
    </div>
  );
}
