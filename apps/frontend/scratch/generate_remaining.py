import os

base_dir = "/home/jobson/Documents/Projects/bit/apps/frontend"

files = {
    "app/lista/layout.tsx": """export default function ListaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}
""",
    "app/lista/[id]/page.tsx": """"use client";
import { useEffect, useState } from "react";
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

export default function RequestDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [data, setData] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setData({
        id: params.id,
        title: 'Manutenção de Equipamento',
        description: 'O ar condicionado da sala 4 parou de funcionar e está pingando água.',
        category: 'FACILITIES',
        status: 'OPEN',
        createdAt: '2023-10-01T10:00:00Z',
        updatedAt: '2023-10-01T10:00:00Z',
        requesterId: 'user-1'
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleDelete = async () => {
    // await fetchApi(`/v1/requests/${params.id}`, { method: 'DELETE' });
    addToast({ title: 'Sucesso', description: 'Solicitação excluída', variant: 'success' });
    router.push('/lista');
  };

  const handleAdvance = async () => {
    // await fetchApi(`/v1/requests/${params.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'IN_PROGRESS' }) });
    setData(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : prev);
    addToast({ title: 'Status atualizado', variant: 'success' });
  };

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!data) return <div className="p-8">Não encontrado</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Link href="/lista" className="font-bold underline hover:decoration-2">Voltar para lista</Link>
      </div>
      <Card className="p-8">
        <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-ink">
          <div>
            <div className="text-sm font-ibm text-muted mb-2">SOL-{data.id.padStart(6, '0')}</div>
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
            {data.requesterId}
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
""",
    "app/lista/[id]/editar/page.tsx": """"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

const schema = z.object({
  title: z.string().min(3, "Mínimo de 3 caracteres").max(120, "Máximo de 120 caracteres"),
  category: z.enum(["IT", "HR", "FACILITIES", "FINANCE", "OTHER"]),
  description: z.string().min(10, "Mínimo de 10 caracteres").max(2000, "Máximo de 2000 caracteres"),
});

export default function EditarSolicitacao({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    setTimeout(() => {
      // Mock fetch
      reset({
        title: 'Manutenção de Equipamento',
        category: 'FACILITIES',
        description: 'O ar condicionado da sala 4 parou de funcionar.'
      });
      setLoading(false);
    }, 500);
  }, [reset]);

  const onSubmit = (data: any) => {
    // mock patch
    addToast({ title: 'Sucesso', description: 'Solicitação atualizada', variant: 'success' });
    router.push(`/lista/${params.id}`);
  };

  if (loading) return <div className="p-8">Carregando...</div>;

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
            <option value="IT">TI</option>
            <option value="HR">RH</option>
            <option value="FACILITIES">Infraestrutura</option>
            <option value="FINANCE">Financeiro</option>
            <option value="OTHER">Outros</option>
          </Select>
          {errors.category && <p className="text-red font-bold mt-1 text-sm">{errors.category.message as string}</p>}
        </div>
        <div>
          <label className="font-bold block mb-2">Descrição</label>
          <textarea {...register("description")} className="flex w-full rounded-sm border-2 border-ink bg-paper px-3 py-2 text-sm text-ink shadow-sm min-h-[150px]" />
          {errors.description && <p className="text-red font-bold mt-1 text-sm">{errors.description.message as string}</p>}
        </div>
        <div className="flex gap-4">
          <Button type="submit">Salvar</Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/lista/${params.id}`)}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
""",
    "components/domain/RequestsTable.tsx": """"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/Table";
import { StatusBadge } from "./StatusBadge";
import { CategoryTag } from "./CategoryTag";
import { RequestItem, PaginatedResponse } from "@/lib/api/types";
import { Button } from "../ui/Button";

interface Props {
  data: PaginatedResponse<RequestItem>;
  onPageChange: (page: number) => void;
}

export function RequestsTable({ data, onPageChange }: Props) {
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

  const totalPages = Math.ceil(data.total / data.pageSize) || 1;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Data de abertura</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={tbodyRef}>
          {data.data.map(req => (
            <TableRow key={req.id} className="cursor-pointer group relative">
              <TableCell className="font-ibm">
                <Link href={`/lista/${req.id}`} className="absolute inset-0 z-10" />
                SOL-{req.id.padStart(6, '0')}
              </TableCell>
              <TableCell className="font-bold group-hover:underline">{req.title}</TableCell>
              <TableCell><CategoryTag category={req.category} /></TableCell>
              <TableCell>{req.requesterId}</TableCell>
              <TableCell>{new Date(req.createdAt).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell><StatusBadge status={req.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center bg-paper border-2 border-ink p-4">
        <span className="font-bold">Página {data.page} de {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={data.page === 1} onClick={() => onPageChange(data.page - 1)}>Anterior</Button>
          <Button variant="outline" disabled={data.page === totalPages} onClick={() => onPageChange(data.page + 1)}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
""",
    "components/domain/FilterBar.tsx": """"use client";
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
          <option value="IT">TI</option>
          <option value="HR">RH</option>
          <option value="FACILITIES">Infraestrutura</option>
          <option value="FINANCE">Financeiro</option>
        </Select>
      </div>
      <div className="w-[180px]">
        <label className="font-bold text-sm block mb-1">Status</label>
        <Select name="status" defaultValue={searchParams.get('status') || ''}>
          <option value="">Todos</option>
          <option value="OPEN">Aberto</option>
          <option value="IN_PROGRESS">Em Atendimento</option>
          <option value="COMPLETED">Concluído</option>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Filtrar</Button>
        <Button type="button" variant="outline" onClick={clearFilters}>Limpar</Button>
      </div>
    </form>
  );
}
""",
    "components/domain/ConfirmDialog.tsx": """"use client";
import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({ open, onOpenChange, onConfirm, title, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mb-6">{description}</p>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button className="bg-red border-red text-paper" onClick={() => { onConfirm(); onOpenChange(false); }}>Confirmar</Button>
      </div>
    </Dialog>
  );
}
""",
    "components/domain/EmptyState.tsx": """import Link from "next/link";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Mark } from "../svg/Mark";

export function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Mark className="w-24 h-24 mb-6 opacity-20" />
      <h3 className="text-xl font-bold mb-2">Nenhuma solicitação encontrada</h3>
      <p className="text-muted mb-6">Você ainda não tem solicitações ou nenhuma corresponde aos filtros.</p>
      <Link href="/lista/nova">
        <Button>Nova solicitação</Button>
      </Link>
    </Card>
  );
}
""",
    "components/Topbar.tsx": """"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "./ui/Icon";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-2 border-ink px-6 bg-paper shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black font-archivo tracking-tight">ÁTRIO</Link>
        <nav className="hidden md:flex gap-6 font-bold">
          <Link 
            href="/dashboard" 
            className={cn("hover:underline hover:decoration-2 hover:underline-offset-4", pathname.startsWith('/dashboard') && "underline decoration-2 underline-offset-4")}
          >
            Dashboard
          </Link>
          <Link 
            href="/lista" 
            className={cn("hover:underline hover:decoration-2 hover:underline-offset-4", pathname.startsWith('/lista') && "underline decoration-2 underline-offset-4")}
          >
            Solicitações
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-bold hidden md:inline">{user.name}</span>
            <button onClick={logout} className="p-2 border-2 border-ink rounded-sm hover:bg-bg" aria-label="Sair">
              <Icon name="log-out" />
            </button>
          </div>
        ) : (
          <Link href="/login" className="font-bold underline">Login</Link>
        )}
      </div>
    </header>
  );
}
""",
    "components/KeyboardShortcuts.tsx": """"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export function KeyboardShortcuts() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let timer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'g') {
        gPressed = true;
        clearTimeout(timer);
        timer = setTimeout(() => { gPressed = false; }, 1000);
        return;
      }

      if (gPressed) {
        if (e.key === '1') router.push('/dashboard');
        if (e.key === '2') router.push('/lista');
        if (e.key === '3') router.push('/lista/nova');
        if (e.key === '4') setShowPanel(true);
        gPressed = false;
        return;
      }

      if (e.key === '?') {
        setShowPanel(true);
      } else if (e.key === 'd') {
        toggleTheme();
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        setShowPanel(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, toggleTheme]);

  if (!showPanel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-paper border-2 border-ink p-8 shadow-lg max-w-md w-full relative">
        <button onClick={() => setShowPanel(false)} className="absolute top-4 right-4 text-ink hover:text-red font-bold">X</button>
        <h2 className="text-2xl font-black font-archivo mb-6">Atalhos de Teclado</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center"><span className="font-bold">g + 1</span> <span>Dashboard</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">g + 2</span> <span>Solicitações</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">g + 3</span> <span>Nova Solicitação</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">? ou g + 4</span> <span>Painel de Atalhos</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">d</span> <span>Alternar Tema</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">/</span> <span>Focar Busca</span></li>
          <li className="flex justify-between items-center"><span className="font-bold">Escape</span> <span>Fechar modais</span></li>
        </ul>
      </div>
    </div>
  );
}
""",
    "components/TransitionProvider.tsx": """"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextData {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextData>({ navigate: () => {}, isTransitioning: false });

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (href: string) => {
    setIsTransitioning(true);
    // Custom logic to animate before pushing goes here...
    // We will simulate it with a timeout for the TransitionStage to play
    setTimeout(() => {
      router.push(href);
      setTimeout(() => setIsTransitioning(false), 300); // clear after navigation
    }, 700);
  };

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
""",
    "components/TransitionStage.tsx": """"use client";
import React, { useEffect, useRef } from "react";
import { useTransition } from "./TransitionProvider";
import gsap from "gsap";

export function TransitionStage() {
  const { isTransitioning } = useTransition();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTransitioning && layerRef.current) {
      // Play Íris out
      gsap.fromTo(layerRef.current, 
        { clipPath: "circle(0% at 50% 50%)", display: 'block' },
        { clipPath: "circle(150% at 50% 50%)", duration: 0.7, ease: "power2.inOut" }
      );
    } else if (!isTransitioning && layerRef.current) {
      // Play Íris in (reveal new page)
      gsap.fromTo(layerRef.current, 
        { clipPath: "circle(150% at 50% 50%)" },
        { clipPath: "circle(0% at 50% 50%)", duration: 0.7, ease: "power2.inOut", onComplete: () => {
          if (layerRef.current) layerRef.current.style.display = 'none';
        }}
      );
    }
  }, [isTransitioning]);

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div ref={layerRef} className="absolute inset-0 bg-ink" style={{ display: 'none' }} />
    </div>
  );
}
""",
    "components/TransitionLink.tsx": """"use client";
import React from "react";
import Link from "next/link";
import { useTransition } from "./TransitionProvider";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function TransitionLink({ href, children, ...props }: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Remaining files generated successfully.")
