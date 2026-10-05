"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/client";

const schema = z.object({
  title: z.string().min(3, "O título deve ter ao menos 3 caracteres"),
  category: z.string().min(1, "A categoria é obrigatória"),
  description: z.string().min(10, "A descrição deve ter ao menos 10 caracteres"),
});

export default function NovaSolicitacao() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setSubmitError(null);

    try {
      await fetchApi("/requests", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/lista");
      router.refresh();
    } catch {
      setSubmitError("Não foi possível criar a solicitação.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black font-archivo mb-8">Nova Solicitação</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="font-bold block mb-2">Título</label>
          <Input {...register("title")} />
          {errors.title && <p className="text-red font-bold mt-1 text-sm">{errors.title.message as string}</p>}
        </div>
        <div>
          <label className="font-bold block mb-2">Categoria</label>
          <Select {...register("category")}>
            <option value="">Selecione...</option>
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
          <textarea {...register("description")} className="flex w-full rounded-sm border-2 border-ink bg-paper px-3 py-2 text-sm text-ink shadow-sm min-h-[100px]" />
          {errors.description && <p className="text-red font-bold mt-1 text-sm">{errors.description.message as string}</p>}
        </div>
        {submitError ? <p className="font-bold text-red-700">{submitError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </div>
  );
}
