import { Mark } from "@/components/svg/Mark";
import { Fan } from "@/components/svg/Fan";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/domain/StatusBadge";

const colors = [
  ["--bg", "Fundo de página"],
  ["--paper", "Cards, tabelas e formulários"],
  ["--ink", "Texto, bordas e sombras"],
  ["--muted", "Texto secundário"],
  ["--red", "Ação primária e marca"],
  ["--blue", "Links e status aberto"],
  ["--yellow", "Foco e acento editorial"],
  ["--terra", "Status em atendimento"],
  ["--moss", "Status concluído"],
  ["--band-bg", "Faixa institucional"],
];

export default function Brandbook() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8 border-2 border-ink bg-band-bg p-6 pb-0 text-band-text">
        <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Mark className="h-12 w-12 text-red" />
              <span className="font-archivo text-2xl">Átrio</span>
            </div>
            <h1 className="font-archivo text-4xl leading-none md:text-6xl">Manual da marca Átrio</h1>
            <p className="mt-4 max-w-2xl text-band-text/80">
              Tokens, componentes e vocabulário gráfico para manter o portal coerente com a pré-visualização do design system.
            </p>
          </div>
          <Fan className="h-auto w-full text-blue" />
        </div>
        <div className="azulejo mt-8" aria-hidden="true" />
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-archivo text-2xl">Cores e Papéis</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {colors.map(([token, role]) => (
            <div key={token} className="border-2 border-ink bg-paper shadow-sm">
              <div className="h-16 border-b-2 border-ink" style={{ background: `var(${token})` }} />
              <div className="p-3">
                <div className="font-ibm text-sm">{token}</div>
                <div className="mt-1 text-sm text-muted">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-archivo text-2xl">Tipografia</h2>
        <div className="border-2 border-ink bg-paper p-6 shadow">
          <p className="mb-4 font-archivo text-3xl">Archivo Black: títulos, marca e comandos</p>
          <p className="mb-4 font-anton text-3xl">ANTON: NUMERAÇÃO EDITORIAL 01 02 03</p>
          <p className="mb-4 text-xl">Inter: corpo, labels, navegação e tabelas do produto.</p>
          <p className="font-ibm text-xl">IBM Plex Mono: SOL-000128 02/10/2026</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-archivo text-2xl">Componentes</h2>
        <div className="grid gap-6 border-2 border-ink bg-paper p-6 shadow">
          <div className="flex flex-wrap gap-4">
            <Button>Primário</Button>
            <Button variant="outline">Secundário</Button>
            <Button disabled>Desabilitado</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="OPEN" />
            <StatusBadge status="IN_PROGRESS" />
            <StatusBadge status="DONE" />
            <span className="badge">TI</span>
            <span className="badge">INFRAESTRUTURA</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Campo de texto
              <input className="h-[42px] border-2 border-ink bg-paper px-3" defaultValue="Valor de exemplo" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Campo de data
              <input className="h-[42px] border-2 border-ink bg-paper px-3" type="date" />
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-archivo text-2xl">Sombras e Grafismos</h2>
        <div className="flex flex-wrap items-start gap-8">
          <div className="w-32 border-2 border-ink bg-paper p-4 font-ibm shadow-sm">4px</div>
          <div className="w-32 border-2 border-ink bg-paper p-4 font-ibm shadow">6px</div>
          <div className="w-32 border-2 border-ink bg-paper p-4 font-ibm shadow-lg">10px</div>
          <Mark className="h-24 w-24 text-red" />
          <div className="azulejo h-24 min-w-72 border-2 border-ink" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
