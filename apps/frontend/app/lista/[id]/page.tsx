"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/domain/StatusBadge";
import { CategoryTag } from "@/components/domain/CategoryTag";
import { ConfirmDialog } from "@/components/domain/ConfirmDialog";
import { fetchApi } from "@/lib/api/client";
import { RequestItem } from "@/lib/api/types";
import { useToast } from "@/context/ToastContext";
import { RequestDetailsSkeleton } from "@/components/domain/PageSkeletons";
import { useAuth } from "@/context/AuthContext";

export default function RequestDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id: requestId } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isAuthLoading || !user) return;

    setLoading(true);
    fetchApi(`/requests/${requestId}`)
      .then((request) => {
        if (isMounted) setData(request);
      })
      .catch(() => {
        if (isMounted) {
          setData(null);
          addToast({ title: 'Erro', description: 'Solicitação não encontrada', variant: 'error' });
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [addToast, isAuthLoading, requestId, user]);

  const handleDelete = async () => {
    try {
      await fetchApi(`/requests/${requestId}`, { method: 'DELETE' });
      addToast({ title: 'Sucesso', description: 'Solicitação excluída', variant: 'success' });
      router.push('/lista');
    } catch {
      addToast({ title: 'Erro', description: 'Não foi possível excluir a solicitação', variant: 'error' });
    }
  };

  const handleAdvance = async () => {
    try {
      const updated = await fetchApi(`/requests/${requestId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });
      setData(updated);
      addToast({ title: 'Status atualizado', variant: 'success' });
    } catch {
      addToast({ title: 'Erro', description: 'Não foi possível atualizar o status', variant: 'error' });
    }
  };

  if (isAuthLoading || !user || loading) return <RequestDetailsSkeleton />;
  if (!data) return <div className="p-8">Não encontrado</div>;
  const requestCode = data.id.startsWith('SOL-') ? data.id : `SOL-${data.id.padStart(6, '0')}`;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Link href="/lista" className="font-bold underline hover:decoration-2">Voltar para lista</Link>
      </div>
      <Card className="p-8">
        <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-ink">
          <div>
            <div className="text-sm font-ibm text-muted mb-2">{requestCode}</div>
            <h1 className="text-3xl font-black font-archivo mb-4">{data.title}</h1>
            <div className="flex gap-4">
              <StatusBadge status={data.status} />
              <CategoryTag category={data.category} />
            </div>
          </div>
          <div className="flex gap-2">
            {data.status === 'OPEN' && (
              <>
                <Button variant="outline" onClick={() => router.push(`/lista/${data.id}/editar`)}>Editar</Button>
                <Button className="bg-red border-red text-paper" onClick={() => setShowConfirm(true)}>Excluir</Button>
                <Button onClick={handleAdvance}>Atender</Button>
              </>
            )}
          </div>
        </div>
        <div className="prose mb-8">
          <h3 className="font-bold mb-2">Descrição</h3>
          <p className="whitespace-pre-wrap bg-bg p-4 border-2 border-ink">{data.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm bg-bg p-4 border-2 border-ink">
          <div>
            <span className="font-bold block">Solicitante</span>
            {data.requesterId ?? '-'}
          </div>
          <div>
            <span className="font-bold block">Criado em</span>
            {new Date(data.createdAt).toLocaleString('pt-BR')}
          </div>
          <div>
            <span className="font-bold block">Atualizado em</span>
            {new Date(data.updatedAt).toLocaleString('pt-BR')}
          </div>
        </div>
      </Card>
      <ConfirmDialog 
        open={showConfirm} 
        onOpenChange={setShowConfirm} 
        onConfirm={handleDelete}
        title="Excluir solicitação"
        description="Tem certeza que deseja excluir? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
