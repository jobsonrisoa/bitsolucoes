import { ArrowRight, ShieldCheck } from "lucide-react";
import { HomeActions } from "@/components/domain/HomeActions";
import { ShortcutsHint } from "@/components/ShortcutsHint";
import { Mark } from "@/components/svg/Mark";
import { Fan } from "@/components/svg/Fan";

export default function Home() {
  return (
    <div className="min-h-full bg-paper">
      <section className="relative border-b-2 border-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-12 lg:py-16">
          <div>
            <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
              <Mark className="h-10 w-10 text-red sm:h-14 sm:w-14" />
              <span className="font-archivo text-2xl sm:text-3xl">Átrio</span>
            </div>
            <h1 className="max-w-4xl font-archivo text-3xl leading-none sm:text-4xl md:text-5xl lg:text-7xl">
              Solicitações internas com entrada clara e saída rastreável.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 md:text-lg md:leading-8 text-muted">
              Um portal para registrar demandas, acompanhar status e manter times alinhados sem perder contexto entre mensagens, planilhas e aprovações soltas.
            </p>
            <HomeActions />
          </div>

          <div className="relative h-[280px] border-2 border-ink bg-bg p-6 shadow-lg md:h-[360px]">
            <div className="absolute right-2 top-2 flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1.5 font-ibm text-[10px] font-bold sm:right-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs">
              <ShieldCheck className="h-3 w-3 text-blue sm:h-4 sm:w-4" />
              acesso protegido
            </div>
            <Fan className="mx-auto mt-8 h-auto w-full max-w-lg text-blue" />
            <div className="absolute bottom-4 left-4 right-4 border-2 border-ink bg-paper p-3 sm:bottom-6 sm:left-6 sm:right-6 sm:p-4">
              <div className="mb-2 flex items-center justify-between font-ibm text-[10px] font-bold uppercase sm:mb-3 sm:text-xs">
                <span>SOL-000128</span>
                <span className="text-blue">em atendimento</span>
              </div>
              <h2 className="font-archivo text-lg sm:text-2xl">Acesso ao sistema financeiro</h2>
              <p className="mt-1 text-xs text-muted sm:mt-2 sm:text-sm">
                Categoria, solicitante, histórico e status em um fluxo único.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-6 md:grid-cols-3">
        {[
          ["Registrar", "Crie solicitações com categoria, descrição e responsável."],
          ["Acompanhar", "Veja o andamento por status, data e código de protocolo."],
          ["Resolver", "Atualize, atenda e encerre solicitações com histórico consistente."],
        ].map(([title, description]) => (
          <div key={title} className="border-2 border-ink bg-bg p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center border-2 border-ink bg-red text-paper">
              <ArrowRight className="h-4 w-4" />
            </div>
            <h3 className="font-archivo text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </div>
        ))}
      </section>

      <ShortcutsHint />
    </div>
  );
}