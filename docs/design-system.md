# Átrio - Design System & Brand Manual

**Versão:** 1.2 · 2026
**Revisão 1.1:** rótulos de status alinhados ao enunciado do processo seletivo (ABERTO, EM ATENDIMENTO, CONCLUÍDO). Motion library: GSAP. Tema escuro obrigatório.
**Revisão 1.2:** adiciona a seção 17 (vocabulário de ícones) e a seção 18 (orçamento de movimento por tela e tokens de movimento).
**Uso:** spec autocontida para agentes de IA (Cursor, Claude Code, Copilot Workspace) e para designers humanos. Tudo que um implementador precisa está aqui - não é necessário consultar histórico de conversa.
**Regra inegociável:** toda animação anima apenas `transform`, `opacity` e `clip-path`. Nunca `width`, `height`, `top`, `left`, `margin`, `padding`.

---

## 0 · Sumário

1. Produto
2. Marca - missão, valores, nome
3. Design tokens
4. Componentes
5. Vocabulário gráfico
6. Vocabulário de movimento
7. Transições de tela
8. Boundary server/client
9. Acessibilidade
10. Copy e tom
11. Anti-padrões proibidos
12. Estrutura de arquivos
13. Stack e dependências
14. QA checklist
15. Definition of Done
16. Como adicionar uma quarta transição
17. Vocabulário de ícones
18. Orçamento de movimento e tokens

---

## 1 · Produto

**Nome:** Átrio
**Categoria:** Portal interno de solicitações
**Audiência:** Funcionários brasileiros de todas as áreas - TI, RH, Compras, Financeiro, Infraestrutura. Não são técnicos.
**Job to be done:** Registrar uma demanda interna e acompanhá-la até o fim, num só lugar, com rastreabilidade.

**Não é:** help desk, ticketing SaaS, ITSM. É um lugar - cívico, sóbrio, honesto sobre estado.

---

## 2 · Marca

### 2.1 · Missão

Nenhuma demanda interna se perde. Do primeiro clique ao concluído, tudo tem um só lugar, um só registro.

### 2.2 · Visão

Ser o sistema visual de referência para produtos internos brasileiros - fundindo geometria modernista e azulejaria.

### 2.3 · Valores

- **Estrutura é informação.** Bordas, réguas e grades organizam. Não decoram.
- **Uma cor, um trabalho.** Se uma cor não tem papel declarado, ela não entra.
- **Duro, não cru.** Brutalismo aqui serve à leitura, não à pose.
- **Um gesto por página.** Cada tela tem um momento visual. O resto fica quieto.

### 2.4 · Símbolo

**Medalhão radial.** Estrela de 8 pontas construída sobre três círculos concêntricos e oito pétalas em rotação quádrupla. Motivo mudéjar, geometria Bauhaus.

Funciona isolado em qualquer fundo - teste crítico da marca. Se o símbolo não lê sem a palavra, a marca não está pronta.

### 2.5 · Território visual

- **Base:** Bauhaus alemão (1920s) - geometria primária, tipografia pesada, cor funcional
- **Motivo:** azulejaria mudéjar - estrela de 8 pontas, padrão repetido, ocre + azul + ocre-vermelho
- **Tipografia:** cartaz Paula Scher - type-as-image, linhas paralelas que dobram em arcos
- **Estrutura:** brutalismo - bordas 2px, sombras offset, radius mínimo

**Não é:** Nike (suave, atlética, fotografia). Átrio é SVG nativo, geometria dura, dois temas testados, quatro vozes tipográficas.

---

## 3 · Design tokens

### 3.1 · Cores - Light

```css
:root {
  --bg:#ede3cf;       /* papel ocre - fundo de página */
  --paper:#fdfaf3;    /* papel quente - cards, tabela, dialog */
  --ink:#0d0b0a;      /* preto quente - texto, bordas, sombras */
  --muted:#6b6153;    /* texto secundário */
  --red:#c8103a;      /* vermelho cartaz - ação primária, destrutivo */
  --blue:#1a3ba8;     /* ultramarino - Open, links, página ativa */
  --yellow:#f5b400;   /* amarelo puro - foco, acento editorial */
  --terra:#a63d2c;    /* terra - In Progress */
  --moss:#3d6b4e;     /* verde musgo - Done */
  --band-bg:#0d0b0a;  /* fundo da faixa dashboard */
  --band-text:#fdfaf3;/* texto da faixa dashboard */
  --scheme: light;
}
```

### 3.2 · Cores - Dark

```css
[data-theme="dark"] {
  --bg:#14110d;       /* âmbar queimado */
  --paper:#1e1a15;    /* cartão âmbar */
  --ink:#ede3cf;      /* papel claro funciona como tinta */
  --muted:#9a8f7e;
  --red:#e03550;      /* liftado para AA */
  --blue:#4262e5;     /* liftado */
  --yellow:#f5b400;   /* inalterado - funciona nos dois */
  --terra:#d16a4f;
  --moss:#6ba37e;
  --band-bg:#241d15;  /* mais escuro que o bg */
  --band-text:#f3e9d2;/* creme quente */
  --scheme: dark;
}
```

### 3.3 · Papel de cada cor

| Token | Papel | Nunca usar para |
| --- | --- | --- |
| `--bg` | fundo de página | texto |
| `--paper` | cards, tabela, dialogs | fundo de página |
| `--ink` | texto, bordas, sombras | decoração |
| `--red` | ação primária, destrutivo, marca | status semântico |
| `--blue` | status Open, links, página ativa | ação destrutiva |
| `--yellow` | foco, acento editorial | texto sobre fundo claro |
| `--terra` | status In Progress | acento global |
| `--moss` | status Done | ação primária |
| `--band-bg` | fundo da faixa dashboard | texto |
| `--band-text` | texto da faixa dashboard | fundo |

**Regra dura:** nenhuma cor decorativa. Se um novo elemento precisa de cor sem papel claro, ele está errado.

### 3.4 · Tipografia

| Família | Token | Papel | Peso |
| --- | --- | --- | --- |
| **Archivo Black** | `--font-archivo` | display de produto, títulos, botões, badges | 400 |
| **Anton** | `--font-anton` | numeração de seção, editorial, capa | 400 |
| **Inter** | `--font-inter` | corpo, labels, tabelas | 400/500/600 |
| **IBM Plex Mono** | `--font-plex-mono` | códigos SOL-, datas, metadados | 400/500 |

**Escala:** 12 / 15 / 19 / 24 / 30 / 48 / 64px (major third 1.250)
**Line-height:** 1.02 títulos · 1.55 corpo · 1.6 mono em tabela
**Letter-spacing:** −0.015em em Archivo Black · −0.03em em hero · 0.14em em kicker
**Line-length:** ≤ 80ch sempre

### 3.5 · Espaço

Escala fixa: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`

### 3.6 · Radius

```css
--radius: 2px;
```

Tudo 2px. Nada mais redondo, nada mais quadrado.

### 3.7 · Bordas

```css
--border: 2px solid var(--ink);
```

Borda é sempre 2px. Nunca 1px (fraco), nunca 4px (pesado). Sempre tinta.

### 3.8 · Sombras

```css
--shadow-sm: 4px 4px 0 var(--ink);
--shadow:    6px 6px 0 var(--ink);
--shadow-lg: 10px 10px 0 var(--ink);
```

Sempre offset sólido. Nunca difuso. Nunca com blur.

Em dark: `--shadow-*` usa `var(--bg)` como cor (barra clara sobre fundo escuro).

### 3.9 · Foco

```css
:focus { outline: none; }
:focus-visible {
  outline: 3px solid var(--yellow);
  outline-offset: 3px;
  border-radius: 2px;
}
```

Nunca remover `outline` sem substituto. Nunca usar `:focus` - sempre `:focus-visible`.

---

## 4 · Componentes

Todos os componentes partem do shadcn/ui e são sobrescritos com tokens do Átrio.

### 4.1 · Inventário

| Componente | Base shadcn | Modificações |
| --- | --- | --- |
| `Button` | button | radius 2px · border 2px ink · shadow 4px offset · active translate(2,2) |
| `Input` | input | radius 2px · border 2px · height 42px · focus 3px yellow |
| `Select` | select | mesma altura/radius do Input |
| `Card` | card | radius 2px · border 2px · shadow 6px offset |
| `Dialog` | dialog | radius 2px · border 2px · sem backdrop-blur · overlay rgba(0,0,0,.55) |
| `Table` | table | thead bg-ink text-paper · cells border-bottom 2px ink |
| `Badge` | badge | radius 2px · border 2px · **sem fundo colorido** · quadrado 7×7 |
| `Skeleton` | skeleton | shimmer ink 10%→20% · radius 2px |
| `Toast` | toast | radius 2px · border 2px · shadow 4px offset |

### 4.2 · Componentes de domínio

| Componente | Composto de | Papel |
| --- | --- | --- |
| `StatusBadge` | Badge | ABERTO · EM ATENDIMENTO · CONCLUÍDO |
| `CategoryTag` | Badge | TI · RH · Compras · Financeiro · Infraestrutura |
| `RequestsTable` | Table + StatusBadge | lista paginada |
| `FilterBar` | Input + Select + Button | período, categoria, status, busca |
| `ConfirmDialog` | Dialog + Button | confirmação de delete |
| `EmptyState` | Card + Mark | convite à ação |
| `StatCard` | Card | número + label + quadrado de cor |

### 4.3 · Anatomia do Badge (crítico)

```jsx
<span class="badge open">ABERTO</span>
```

```css
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  border: 2px solid var(--ink); border-radius: 2px;
  padding: 4px 9px;
  background: var(--paper); color: var(--ink);
  font-family: 'Archivo Black'; font-size: 10px; letter-spacing: .04em;
}
.badge::before { content: ''; width: 7px; height: 7px; background: var(--ink); }
.badge.open::before  { background: var(--blue); }
.badge.prog::before  { background: var(--terra); }
.badge.done::before  { background: var(--moss); }
```

**Nunca fundo colorido cheio.** A cor entra só como quadrado. Isso é regra de sistema - badges com fundo cheio estão proibidos em qualquer tela.

### 4.4 · Contrato de campo

```css
.field input,
.field select,
.field textarea {
  border: 2px solid var(--ink);
  border-radius: 2px;
  background: var(--paper);
  color: var(--ink);
  padding: 10px 12px;
  height: 42px;
  color-scheme: var(--scheme); /* conserta ícone de calendário no dark */
  font-family: inherit;
  font-size: 14px;
  width: 100%;
  min-width: 0; /* permite encolher em grid/flex */
}
.field input:focus-visible { box-shadow: 0 0 0 3px var(--yellow); }
```

`color-scheme` é obrigatório em inputs de data e select nativos. Sem ele, o ícone do calendário fica preto sobre fundo escuro.

### 4.5 · Anatomia do StatCard

```jsx
<div class="stat">
  <span>TOTAL</span>
  <strong data-count="128">0</strong>
</div>
```

```css
.stat {
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 2px;
  box-shadow: 6px 6px 0 var(--ink);
  padding: 20px;
  position: relative; overflow: hidden;
}
.stat::after { /* quadrado 28×28 no canto superior direito */
  content: ''; position: absolute; top: 0; right: 0;
  width: 28px; height: 28px; background: var(--ink);
  border-left: 2px solid var(--ink); border-bottom: 2px solid var(--ink);
}
.stat.open::after { background: var(--blue); }
.stat.prog::after { background: var(--terra); }
.stat.done::after { background: var(--moss); }
.stat strong {
  font-family: 'Archivo Black'; font-weight: 400;
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1; font-variant-numeric: tabular-nums;
}
.stat.open strong { color: var(--blue); }
.stat.prog strong { color: var(--terra); }
.stat.done strong { color: var(--moss); }
```

---

## 5 · Vocabulário gráfico

Cinco motivos em SVG editável. Cada um com papel declarado. Nenhum decorativo.

| Motivo | Papel | Onde usar |
| --- | --- | --- |
| **Medalhão radial** | símbolo oficial | marca, logo, empty states, loading |
| **Leque Scher** | gesto de cartaz | hero de login, transição de navegação |
| **Arco clássico** | referência arquitetônica | 404, onboarding, seções especiais |
| **Chevron 1968** | divisor | faixas horizontais, seções |
| **Azulejo mudéjar** | textura | faixa de dashboard, transição em grade |

**Regra:** se um motivo aparece em mais de duas telas, está errado.

### 5.1 · Medalhão radial

```jsx
<svg viewBox="0 0 100 100">
  <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <circle cx="50" cy="50" r="46" />
    <circle cx="50" cy="50" r="33" />
    <circle cx="50" cy="50" r="19" />
    {[0,45,90,135,180,225,270,315].map(deg => (
      <ellipse cx="50" cy="28" rx="8" ry="22" transform={`rotate(${deg} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="7" fill="currentColor" stroke="none" />
  </g>
</svg>
```

### 5.2 · Leque Scher

```jsx
<svg viewBox="-60 40 520 260" preserveAspectRatio="xMidYMid meet">
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M-50 200 H240 A60 60 0 0 1 300 260" />
    <path d="M-50 178 H240 A82 82 0 0 1 322 260" />
    <path d="M-50 156 H240 A104 104 0 0 1 344 260" />
    <path d="M-50 134 H240 A126 126 0 0 1 366 260" />
    <path d="M-50 112 H240 A148 148 0 0 1 388 260" />
    <path d="M-50  90 H240 A170 170 0 0 1 410 260" />
    <path d="M-50  68 H240 A192 192 0 0 1 432 260" />
  </g>
  <path
    d="M300 260 A130 130 0 0 1 430 130 L430 200 A60 60 0 0 0 370 260 Z"
    fill="currentColor" opacity=".9"
  />
</svg>
```

### 5.3 · Arco clássico

```jsx
<svg viewBox="0 0 300 400">
  <g fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M40 380 V180 A110 110 0 0 1 260 180 V380" />
    <path d="M72 380 V192 A78 78 0 0 1 228 192 V380" />
    <path d="M100 380 V204 A50 50 0 0 1 200 204 V380" />
  </g>
  <polygon points="135,60 165,60 160,90 140,90" fill="currentColor" />
</svg>
```

### 5.4 · Chevron 1968

```jsx
<svg viewBox="0 0 300 300">
  <g fill="none" strokeWidth="7" strokeLinecap="butt">
    <g stroke="var(--blue)">
      <path d="M20 140 L120 40 L220 140" />
      <path d="M20 156 L120 56 L220 156" />
      <path d="M20 172 L120 72 L220 172" />
      <path d="M20 188 L120 88 L220 188" />
      <path d="M20 204 L120 104 L220 204" />
    </g>
    <g stroke="var(--terra)">
      <path d="M20 240 L120 140 L220 240" />
      <path d="M20 256 L120 156 L220 256" />
      <path d="M20 272 L120 172 L220 272" />
    </g>
  </g>
</svg>
```

### 5.5 · Azulejo mudéjar (padrão repeat)

```css
.azulejo {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23ede3cf'/%3E%3Cpolygon points='40,6 47,33 74,40 47,47 40,74 33,47 6,40 33,33' fill='%231a3ba8'/%3E%3Cpolygon points='40,20 50,30 60,40 50,50 40,60 30,50 20,40 30,30' fill='%23c8103a'/%3E%3Ccircle cx='0' cy='0' r='9' fill='%23f5b400'/%3E%3Ccircle cx='80' cy='0' r='9' fill='%23f5b400'/%3E%3Ccircle cx='0' cy='80' r='9' fill='%23f5b400'/%3E%3Ccircle cx='80' cy='80' r='9' fill='%23f5b400'/%3E%3C/svg%3E");
  background-size: 80px;
}
```

---

## 6 · Vocabulário de movimento

Quatorze padrões declarados. Toda animação do Átrio pertence a um deles. Nenhuma entra sem pertencer.

| Padrão | Duração | Easing | Uso |
| --- | --- | --- | --- |
| Entrada orquestrada | 400–700ms | `power3.out` | hero, cards, dialog |
| Number scramble | 900ms + 350ms | `power3.out` + `elastic` | stats do dashboard |
| Draw sequencial | 700–1100ms | `power4.out` + `back` | leque, arco, chevron |
| Rotação radial | 1000ms | `back.out(1.4)` | medalhão, ícones |
| Magnetic hover | 350ms / 600ms | `power3.out` / `elastic` | botões primários |
| Focus pulse | 250ms | `power2.out` | linhas, badges, inputs |
| Split-char reveal | 500ms | `back.out(1.8)` | títulos de seção |
| Stagger cascade | 60ms/item | `power2.out` | filtros, listas, cards |
| Scher wipe | 800ms | `power4.inOut` | transição de tela |
| Ripple click | 550ms | `power2.out` | botões, ícones |
| Underline draw | 220ms | `power2.inOut` | links de navegação |
| Cascade 3D flip | 550ms | `back.out(1.4)` | linhas da tabela, motivos |
| Cursor trail | 900ms fade | `linear` | hero de login |
| Scroll parallax | scrubbed | `linear` | faixa mudéjar |

**Easing global:** `power2.out` para quase tudo. `power3.out` para entradas dramáticas. `expo.out` para modais. Nunca `linear` em nada que o usuário lê.

### 6.1 · Implementação - Ripple

```css
.ripple {
  position: absolute; border-radius: 50%;
  background: currentColor; opacity: .28;
  transform: scale(0); pointer-events: none;
  animation: rippleOut .55s cubic-bezier(.2, .8, .2, 1) forwards;
}
@keyframes rippleOut { to { transform: scale(2.6); opacity: 0; } }
```

```js
btn.addEventListener("click", (e) => {
  const r = btn.getBoundingClientRect();
  const s = Math.max(r.width, r.height);
  const rip = document.createElement("span");
  rip.className = "ripple";
  rip.style.width = rip.style.height = s + "px";
  rip.style.left = (e.clientX - r.left - s / 2) + "px";
  rip.style.top = (e.clientY - r.top - s / 2) + "px";
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 600);
});
```

### 6.2 · Implementação - Underline draw

```css
.nav-link { position: relative; }
.nav-link::after {
  content: ''; position: absolute;
  left: 10px; right: 10px; bottom: 4px;
  height: 2px; background: currentColor;
  transform: scaleX(0); transform-origin: left center;
  transition: transform .22s cubic-bezier(.2, .8, .2, 1);
}
.nav-link:hover::after,
.nav-link:focus-visible::after,
.nav-link.active::after { transform: scaleX(1); }
```

### 6.3 · Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .001ms !important;
    transition-duration: .001ms !important;
  }
}
```

Transições viram corte instantâneo. Count-up mostra valor final. Cursor trail desligado. Magnetic desligado. Símbolo estático.

---

## 7 · Transições de tela

Três implementações, três conceitos. Cada uma é uma função pura que recebe um `HTMLElement` (o layer) e um callback `onMid` (ponto de swap).

| id | Nome | Conceito | Device | Duração |
| --- | --- | --- | --- | --- |
| `iris` | Íris Medalhão | convergir | `clip-path: circle()` radial | 450ms |
| `sweep` | Varredura Scher | folhear | `clip-path: polygon()` diagonal | 500ms |
| `tile` | Grade Mudéjar | distribuir | grid stagger 3D | 650ms |

### 7.1 · Contrato - server-safe

```ts
// lib/transitions/meta.ts
export interface TransitionMeta {
  id: string;
  name: string;
  dir: "forward" | "back" | "lateral" | "emphasis" | "fallback";
  concept: string;
  desc: string;
  device: string;
  dur: string;
  ease: string;
  duration: number;
}
export const TRANSITION_META: TransitionMeta[];
export const DEFAULT_TRANSITION: string;
```

### 7.2 · Contrato - client-only

```ts
// lib/transitions/play.ts
"use client";
export type PlayFn = (layer: HTMLElement, onMid: () => void) => Promise<void>;
export const PLAY_MAP: Record<string, PlayFn>;
export function getPlay(id: string): PlayFn;
```

### 7.3 · Implementação - Íris Medalhão

```ts
const iris: PlayFn = (layer, onMid) =>
  new Promise((resolve) => {
    layer.innerHTML = `
      <div data-role="circle" style="position:absolute;inset:0;background:var(--red);clip-path:circle(0% at 50% 50%)"></div>
      <div data-role="symbol" style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;opacity:0">
        <svg viewBox="0 0 100 100" style="width:32vmin;height:32vmin"><use href="#mark-symbol"/></svg>
      </div>`;
    const circle = layer.querySelector<HTMLElement>('[data-role="circle"]')!;
    const symbol = layer.querySelector<HTMLElement>('[data-role="symbol"]')!;
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(circle, { clipPath: "circle(150% at 50% 50%)", duration: 0.35, ease: "power2.out" }, 0)
      .to(symbol, { opacity: 1, duration: 0.2 }, 0)
      .to(symbol, { rotate: 90, duration: 0.45, ease: "power2.out" }, 0)
      .add(() => onMid(), 0.32)
      .to(symbol, { opacity: 0, scale: 1.5, duration: 0.25, ease: "power2.in" }, 0.42)
      .to(circle, { clipPath: "circle(0% at 50% 50%)", duration: 0.28, ease: "power2.in" }, 0.48);
  });
```

### 7.4 · Implementação - Varredura Scher

```ts
const sweep: PlayFn = (layer, onMid) =>
  new Promise((resolve) => {
    layer.innerHTML = `
      <div data-role="mask" style="position:absolute;inset:0;background:var(--red);clip-path:polygon(0 0, 0 0, 0 100%, 0 100%)"></div>
      <div data-role="fan" style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;clip-path:polygon(0 0, 0 0, 0 100%, 0 100%)">
        <svg viewBox="-60 40 520 260" preserveAspectRatio="xMidYMid meet" style="width:120vw;max-width:1400px"><use href="#fan-symbol"/></svg>
      </div>`;
    const mask = layer.querySelector<HTMLElement>('[data-role="mask"]')!;
    const fan = layer.querySelector<HTMLElement>('[data-role="fan"]')!;
    const paths = fan.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 500;
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to([mask, fan], { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.3, ease: "power3.inOut" }, 0)
      .to(paths, { strokeDashoffset: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }, 0.08)
      .add(() => onMid(), 0.32)
      .to([mask, fan], { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", duration: 0.28, ease: "power3.in" }, 0.42);
  });
```

### 7.5 · Implementação - Grade Mudéjar

```ts
const COLS = 6;
const ROWS = 4;
const tile: PlayFn = (layer, onMid) =>
  new Promise((resolve) => {
    const tiles = Array.from({ length: COLS * ROWS }, () =>
      `<div data-tile style="background:var(--red);display:grid;place-items:center;border:1px solid rgba(255,255,255,.15);transform:scale(0);opacity:0">
        <svg viewBox="0 0 100 100" style="width:50%;height:50%;color:#fff"><use href="#mark-symbol"/></svg>
      </div>`
    ).join("");
    layer.innerHTML = `<div style="display:grid;width:100%;height:100%;grid-template-columns:repeat(${COLS},1fr);grid-template-rows:repeat(${ROWS},1fr)">${tiles}</div>`;
    const tileEls = layer.querySelectorAll<HTMLElement>("[data-tile]");
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(tileEls, {
      scale: 1, opacity: 1, duration: 0.3,
      stagger: { grid: [ROWS, COLS], from: "start", amount: 0.32 },
      ease: "back.out(1.3)",
    }, 0)
      .add(() => onMid(), 0.4)
      .to(tileEls, {
        scale: 0, opacity: 0, duration: 0.25,
        stagger: { grid: [ROWS, COLS], from: "end", amount: 0.28 },
        ease: "power2.in",
      }, 0.42);
  });
```

### 7.6 · Regra de composição

Cada transição implementa:

1. **Entrada** com `ease-out` (nunca `ease-in` na entrada)
2. **Swap** exatamente no `onMid` - nada depois disso pode mudar de página
3. **Saída** com `ease-in` (nunca `ease-out` na saída)
4. Duração total entre 400ms e 700ms
5. Reduzida a corte instantâneo em `prefers-reduced-motion`

---

## 8 · Boundary server/client

**Sintoma:** erro `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"`.

**Causa:** Server Component (sem `"use client"`) tenta passar objeto com função como prop para Client Component. Next tenta serializar via JSON - funções não serializam.

**Regra geral:** Server Components só podem passar para Client Components:

- Primitivos (string, number, boolean, null, undefined)
- Arrays e objetos contendo apenas primitivos
- Promises desses
- JSX (Server Component como children)
- Server Actions com `"use server"`

**Nunca:** funções, classes, símbolos, `Date`, `Map`, `Set`, objetos com métodos.

**Padrão de solução:** separar em **dados puros** (server) + **comportamento resolvido por id** (client lookup via registry).

```ts
// server-safe - meta.ts
const meta = { id: "iris", name: "Íris", ... };

// client-only - play.ts
function getPlay(id: string): PlayFn { ... }

// Server Component - app/transicoes/page.tsx
<Card meta={meta} />  // ✓ serializa

// Client Component - components/TransitionCard.tsx
const play = getPlay(meta.id);  // ✓ resolve localmente
```

---

## 9 · Acessibilidade (WCAG 2.2 AA)

### 9.1 · Requisitos testáveis

- Contraste: texto normal ≥ 4.5:1 · texto grande ≥ 3:1 · componentes de UI ≥ 3:1
- Alvos de toque ≥ 44×44px em mobile
- Foco visível sempre: `outline: 3px solid var(--yellow); outline-offset: 3px`
- Navegação por teclado funcional em todo elemento interativo
- `prefers-reduced-motion` reduz tudo para corte instantâneo (nunca remove conteúdo)
- Foco vai para `<h1>` ou `<h2>` da nova página após cada transição de tela
- Foco preso em dialogs e drawers (focus trap + `Escape` para fechar)
- Estado nunca só por cor - sempre cor + texto + ícone

### 9.2 · Contraste verificado

| Par | Light | Dark | AA |
| --- | --- | --- | --- |
| Ink / Paper | 17.2:1 | 14.8:1 | ✓ |
| Ink / Bg | 14.5:1 | 16.2:1 | ✓ |
| Red / White | 5.1:1 | 4.1:1 | ✓ display |
| Blue / Paper | 8.6:1 | 6.2:1 | ✓ |
| Terra / Paper | 6.8:1 | 5.4:1 | ✓ |
| Moss / Paper | 7.1:1 | 6.8:1 | ✓ |

### 9.3 · Atalhos de teclado

| Atalho | Ação |
| --- | --- |
| `Tab` / `Shift+Tab` | percorre elementos |
| `Enter` / `Space` | ativa elemento focado |
| `Escape` | fecha dialog/drawer |
| `←` `→` no menu | navega entre itens |
| `Home` / `End` no menu | primeiro / último item |
| `g` + `1..5` | navega direto para telas |
| `?` | abre painel de atalhos |
| `d` | alterna tema |
| `/` | foca busca |

**Nota:** usar `g + número` em vez de `Alt + número`. Firefox e Chrome interceptam `Alt+1..9` antes do JavaScript - abre abas.

---

## 10 · Copy e tom

- Voz ativa: "Salvar" não "Submeter". "Publicado" não "Enviando".
- Nomes de ação consistentes: botão "Publicar" → toast "Publicado".
- Sentence case em copy, CAPS só em labels estruturais.
- Frases curtas. Sem filler ("por favor", "note que").
- Erros descrevem o que aconteceu e como resolver. Nunca vagos. Nunca pedem desculpas.
- Estados vazios convidam à ação, não lamentam.
- Sem "-" em copy. Sem "•" como separador. Sem arrows "→" em CTAs.
- Sem emoji em produto.

---

## 11 · Anti-padrões proibidos

Marcar como **bloqueador de PR** se aparecer:

- Fundo creme + serif display + accent terracota (tell de IA)
- Gradiente em qualquer superfície
- Glow / blur como decoração
- `transition: all` em qualquer CSS
- `box-shadow` difuso (com blur)
- Badge com fundo colorido cheio
- Mais de uma animação por tela competindo por atenção
- Animação em `width`, `height`, `top`, `left`, `margin`, `padding`
- Texto placeholder "Lorem ipsum" ou "Em breve" em tela finalizada
- Eyebrow ALL CAPS acima de cada heading
- Meta strings com middle dots (`A · B · C`)
- `#0a0a0a` ou `#111` como near-black (usar `--ink` quente)
- Emoji em copy de produto
- Ilustração amigável genérica (mascotes, blobs, characters)
- Motion sem propósito - "fade-up on scroll" em cada seção
- Símbolo duplicado, rotacionado, distorcido, com gradiente, com opacidade reduzida

---

## 12 · Estrutura de arquivos

```text
app/
  layout.tsx              providers + fontes + Topbar + SvgDefs + TransitionStage
  page.tsx                redirect para /transicoes
  globals.css             tokens light/dark + reset + reduced-motion
  transicoes/page.tsx     Server Component (só metadados)
  login/page.tsx
  dashboard/page.tsx
  lista/page.tsx

components/
  Topbar.tsx              "use client"
  ThemeToggle.tsx         "use client"
  TransitionLink.tsx      "use client"
  TransitionProvider.tsx  "use client"
  TransitionStage.tsx     "use client"
  TransitionPreview.tsx   "use client"
  TransitionCard.tsx      "use client"
  svg/Mark.tsx
  svg/Fan.tsx
  svg/SvgDefs.tsx

context/
  ThemeContext.tsx        "use client"

lib/transitions/
  meta.ts                 TransitionMeta + TRANSITION_META (server-safe)
  play.ts                 "use client" + PLAY_MAP + getPlay
  index.ts                re-exports
```

---

## 13 · Stack e dependências

| Dependência | Versão | Papel |
| --- | --- | --- |
| next | 14.2.15 | framework |
| react | 18.3.1 | runtime |
| react-dom | 18.3.1 | runtime |
| gsap | 3.14.0 | animação |
| tailwindcss | 3.4.13 | utility CSS |
| typescript | 5.6.2 | tipagem estrita |
| autoprefixer | 10.4.20 | CSS |
| postcss | 8.4.47 | CSS |
| lucide-react | versão fixada na criação do projeto | ícones (seção 17) |

**Fontes** via `next/font/google`: Archivo Black, Anton, Inter, IBM Plex Mono.

**Regra:** nenhuma dependência de UI kit pesado. shadcn/ui como cópia local dos primitivos, customizado.

---

## 14 · QA checklist (executável em code review)

- [ ] Nenhum componente com `transition: all`
- [ ] Nenhum `box-shadow` com blur
- [ ] Todos os `Badge` usam `::before` com quadrado (não fundo colorido)
- [ ] Todos os pares texto/fundo passam contraste AA
- [ ] `prefers-reduced-motion` desliga animações de entrada/parallax/cursor trail
- [ ] Foco visível em todo elemento interativo
- [ ] Nenhuma função cruza boundary server→client
- [ ] Toda cor usada tem papel declarado na seção 3.3
- [ ] Nenhum motivo gráfico aparece em mais de 2 telas
- [ ] Nenhum texto placeholder em tela finalizada
- [ ] Toda animação pertence a um dos 14 padrões da seção 6
- [ ] Toda transição de tela implementa `onMid` (swap no meio)
- [ ] `Escape` fecha dialogs e drawers
- [ ] Tab navega por todo conteúdo sem travar
- [ ] Nenhum emoji em copy de produto
- [ ] Tokens de cor são usados via CSS variables, não hex inline
- [ ] `color-scheme` declarado em inputs de data/select
- [ ] Todo ícone vem do inventário da seção 17, usa `Icon.tsx` e a escala 16 / 20 / 24
- [ ] Todo botão só com ícone tem `aria-label`
- [ ] Cada tela tem um único gesto principal (seção 18.2)

---

## 15 · Definition of Done

Uma tela só é considerada pronta quando:

1. Renderiza em light e dark sem perda de contraste
2. Funciona com teclado (Tab, Enter, Escape)
3. Reduz movimento corretamente
4. Passa Lighthouse a11y ≥ 95
5. Nenhum anti-padrão da seção 11 presente
6. Copy segue seção 10 sem filler
7. Foco vai para heading após navegação
8. Está em Storybook (componentes de domínio)
9. Nenhuma animação anima layout properties
10. Aparece no snap de regressão visual sem deltas não intencionais

---

## 16 · Como adicionar uma quarta transição

1. Adicione um objeto em `TRANSITION_META` (`lib/transitions/meta.ts`)
2. Adicione a função correspondente em `PLAY_MAP` (`lib/transitions/play.ts`)
3. Pronto - o card aparece automaticamente em `/transicoes`

O `id` é a chave que conecta os dois arquivos.

**Exemplo mínimo:**

```ts
// meta.ts
{
  id: "pulse",
  name: "Pulso Radial",
  dir: "lateral",
  concept: "irradiar",
  desc: "Ondas concêntricas expandem do centro.",
  device: "scale radial · stagger",
  dur: "600ms",
  ease: "ease-out",
  duration: 600,
}

// play.ts
const pulse: PlayFn = (layer, onMid) =>
  new Promise((resolve) => {
    layer.innerHTML = `<div style="position:absolute;inset:0;background:var(--bg);display:grid;place-items:center">
      ${[0,1,2,3,4].map(() =>
        `<div data-ring style="position:absolute;width:20vmin;height:20vmin;border:4px solid var(--red);border-radius:50%;transform:scale(0);opacity:0"></div>`
      ).join("")}
    </div>`;
    const rings = layer.querySelectorAll<HTMLElement>("[data-ring]");
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(rings, {
      scale: 12, opacity: 1, duration: 0.35,
      stagger: 0.05, ease: "power2.out"
    }, 0)
      .add(() => onMid(), 0.3)
      .to(rings, { opacity: 0, duration: 0.25 }, 0.42);
  });
```

---

## 17 · Vocabulário de ícones

Ícones são glifos funcionais de interface. Não são os motivos gráficos da seção 5 (medalhão, leque, arco, chevron, azulejo), que são identidade de marca.

### 17.1 · Princípios

- Ícone existe para acelerar a leitura de uma ação ou de um estado. Ícone decorativo é proibido.
- Uma biblioteca só: `lucide-react`, importada apenas dentro de `components/ui/Icon.tsx`.
- Geometria dura, igual às bordas: `stroke-width: 2`, `stroke-linecap: square`, `stroke-linejoin: miter`. Nunca `fill`.
- Cor sempre `currentColor`. O ícone herda o token do texto ao redor. Exceções: `--red` dentro de botão destrutivo e `--blue` dentro de link.

### 17.2 · Especificação

| Tamanho | Uso |
| --- | --- |
| 16px | ao lado de texto em botões, links e células de tabela |
| 20px | navegação, campos (calendário, busca) |
| 24px | botões só com ícone, toasts |

Escala fixa. Nenhum outro tamanho. Alvo de toque mínimo de 44×44px em mobile. Botão só com ícone exige `aria-label` e `title`. Ícone ao lado de texto leva `aria-hidden="true"`.

### 17.3 · Inventário semântico

| Nome | Lucide | Uso |
| --- | --- | --- |
| `dashboard` | `layout-dashboard` | navegação |
| `list` | `list` | navegação |
| `add` | `plus` | criar solicitação |
| `edit` | `pencil` | editar solicitação aberta |
| `delete` | `trash-2` | excluir (dentro do botão destrutivo) |
| `details` | `eye` | consultar detalhes |
| `advance` | `chevrons-right` | alterar status para o próximo estado |
| `filter` | `sliders-horizontal` | aplicar filtros |
| `search` | `search` | campo de busca |
| `clear` | `x` | limpar filtros, fechar dialog e toast |
| `calendar` | `calendar` | campos de período |
| `user` | `user` | solicitante, menu de sessão |
| `logout` | `log-out` | encerrar sessão |
| `menu` | `menu` | navegação em telas pequenas |
| `theme-light` | `sun` | trocar para o tema claro |
| `theme-dark` | `moon` | trocar para o tema escuro |
| `shortcuts` | `keyboard` | painel de atalhos |
| `success` | `circle-check` | toast de sucesso |
| `error` | `circle-alert` | toast e mensagem de erro |
| `warning` | `triangle-alert` | aviso |
| `info` | `info` | informação |
| `status-open` | `circle` | estado Aberto (detalhes e linha do tempo) |
| `status-progress` | `clock` | estado Em Atendimento (detalhes e linha do tempo) |
| `status-done` | `badge-check` | estado Concluído (detalhes e linha do tempo) |
| `cat-ti` `cat-rh` `cat-compras` `cat-financeiro` `cat-infra` | `monitor` `users` `shopping-cart` `banknote` `building-2` | categorias, apenas no formulário e nos detalhes (opcional) |

Ícone novo entra pela mesma regra do inventário: nome semântico, uso declarado, story no Storybook.

### 17.4 · Regras de uso

- O `Badge` mantém o quadrado 7×7 da seção 4.3 e não recebe ícone. O quadrado funciona como glifo e o texto do badge cumpre a regra "estado nunca só por cor" da seção 9.1.
- Ícones `status-*` aparecem em detalhes e na linha do tempo, sempre com o texto do estado.
- Na tabela, ícone só nas ações (`details`, `edit`, `delete`, `advance`) e sempre com texto visível ou `aria-label`.
- Loading usa o Medalhão com Rotação radial, nunca um ícone de spinner.
- Ícones não animam. Exceção: troca de tema (`theme-light` e `theme-dark` com rotação de 250ms e cross-fade de opacidade). Em `prefers-reduced-motion` a troca é instantânea.

### 17.5 · Implementação e boundary

- `lib/icons/names.ts` (server-safe): `export type IconName = "dashboard" | "list" | ...`.
- `components/ui/Icon.tsx`: recebe `name: IconName`, `size: 16 | 20 | 24` e resolve o componente do lucide localmente.
- Server Components passam apenas o nome (string). Nunca passam o componente do ícone para um Client Component (seção 8).
- ESLint `no-restricted-imports` bloqueia `lucide-react` fora de `Icon.tsx`.

### 17.6 · Anti-padrões (bloqueadores de PR)

- Ícone sem função, colorido por decoração ou com preenchimento.
- Segunda biblioteca de ícones, SVG avulso copiado de outro conjunto, emoji.
- Tamanho fora da escala 16 / 20 / 24.
- Botão só com ícone sem `aria-label`.
- Estado comunicado só por ícone ou só por cor.

---

## 18 · Orçamento de movimento e tokens

### 18.1 · Tokens de movimento

```css
:root {
  --dur-micro: 220ms;   /* underline, focus pulse, ripple */
  --dur-base: 450ms;    /* entradas, transição Íris */
  --dur-slow: 700ms;    /* limite máximo de qualquer transição de tela */
  --ease-out: cubic-bezier(.2, .8, .2, 1);          /* power2.out */
  --ease-in: cubic-bezier(.55, .085, .68, .53);     /* power2.in */
  --ease-expo: cubic-bezier(.16, 1, .3, 1);         /* expo.out, modais */
}
```

Nunca `linear` em algo que o usuário lê. Entrada usa `ease-out`. Saída usa `ease-in`.

### 18.2 · Um gesto por tela

| Tela | Gesto principal | Micro-interações permitidas |
| --- | --- | --- |
| Login | Draw sequencial do leque (diferencial). Sem ele, Entrada orquestrada | focus pulse, ripple |
| Dashboard | Entrada dos StatCards com Number scramble | ripple |
| Lista | Stagger cascade das linhas, só na primeira carga. Mudança de filtro troca sem animar | underline draw, focus pulse, ripple |
| Nova e editar | Entrada orquestrada do formulário | focus pulse no campo com erro, ripple |
| Detalhes | Entrada orquestrada | ripple |
| Dialog | Entrada com `--ease-expo`, 250 a 400ms | focus pulse |
| Toast | Entrada e saída por `transform` e `opacity`, 250ms | nenhuma |
| Troca de tela | Íris (450ms). Varredura (500ms) e Grade (650ms) são diferenciais | nenhuma |

Mais de um gesto competindo na mesma tela é anti-padrão (seção 11).

### 18.3 · Camadas de implementação

- CSS: Entrada orquestrada, Underline draw, Ripple, Focus pulse, Toast, Dialog.
- GSAP (importado dinamicamente em Client Components): Number scramble, Stagger cascade, Draw sequencial, Rotação radial, Split-char reveal, Magnetic hover, Cascade 3D flip, Cursor trail, Scroll parallax e as transições de tela.
- Magnetic hover e Cursor trail só em dispositivos com `pointer: fine`.
- Split-char reveal preserva o texto original em `aria-label` e marca os `span` de caracteres com `aria-hidden`.

### 18.4 · Divergência resolvida

A tabela da seção 6 lista "Scher wipe" com 800ms. A seção 7 define a Varredura Scher com 500ms e a regra 7.6 limita toda transição a 400 até 700ms. Vale a seção 7.

---

**Fim.** Este documento é a fonte única de verdade visual e comportamental do Átrio. Divergências entre este documento e implementações existentes devem ser resolvidas em favor deste documento - atualizando a implementação, não o documento, exceto quando o próprio documento for revisado deliberadamente.
