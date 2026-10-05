"use client";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { RequestFormSkeleton } from "@/components/domain/PageSkeletons";
import { fetchApi } from "@/lib/api/client";
import { RequestItem } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  title: z.string().min(3, "Mínimo de 3 caracteres").max(120, "Máximo de 120 caracteres"),
  category: z.enum(["TI", "RH", "COMPRAS", "FINANCEIRO", "INFRAESTRUTURA"]),
  description: z.string().min(10, "Mínimo de 10 caracteres").max(2000, "Máximo de 2000 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function EditarSolicitacao({ params }: { params: Promise<{ id: string }> }) {
  const { id: requestId } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    let isMounted = true;
    if (isAuthLoading || !user) return;

    setLoading(true);
    fetchApi(`/requests/${requestId}`)
      .then((request: RequestItem) => {
        if (!isMounted) return;
        reset({
          title: request.title,
          category: request.category as FormValues["category"],
          description: request.description,
        });
      })
      .catch(() => {
        if (isMounted) {
          addToast({ title: 'Erro', description: 'Solicitação não encontrada', variant: 'error' });
          router.push('/lista');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [addToast, isAuthLoading, requestId, reset, router, user]);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);

    try {
      const updated: RequestItem = await fetchApi(`/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      addToast({ title: 'Sucesso', description: 'Solicitação atualizada', variant: 'success' });
      router.push(`/lista/${updated.id}`);
      router.refresh();
    } catch {
      setSubmitError('Não foi possível atualizar a solicitação.');
    }
  };

  if (isAuthLoading || !user || loading) return <RequestFormSkeleton />;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black font-archivo mb-8">Editar Solicitação</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="font-bold block mb-2">Título</label>
          <Input {...register("title")} />
          {errors.title && <p className="text-red font-bold mt-1 text-sm">{errors.title.message as string}</p>}
        </div>
        <div>
          <label className="font-bold block mb-2">Categoria</label>
          <Select {...register("category")}>
            <option value="TI">TI</option>
            <option value="RH">RH</option>
            <option value="COMPRAS">Compras</option>
            <option value="FINANCEIRO">Financeiro</option>
            <option value="INFRAESTRUTURA">Infraestrutura</option>
          </Select>
          {errors.category && <p className="text-red font-bold mt-1 text-sm">{errors.category.message as string}</p>}
        </div>
        <div>
          <label className="font-bold block mb-2">Descrição</label>
          <textarea {...register("description")} className="flex w-full rounded-sm border-2 border-ink bg-paper px-3 py-2 text-sm text-ink shadow-sm min-h-[150px]" />
          {errors.description && <p className="text-red font-bold mt-1 text-sm">{errors.description.message as string}</p>}
        </div>
        {submitError ? <p className="font-bold text-red-700">{submitError}</p> : null}
        <div className="flex gap-4">
          <Button type="submit">Salvar</Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/lista/${requestId}`)}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
