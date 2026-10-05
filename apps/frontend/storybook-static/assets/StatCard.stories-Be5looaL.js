import{j as o}from"./jsx-runtime-DFAAy_2V.js";import{r as p}from"./index-Bc2G9s8g.js";import{g as E}from"./index-CcQw-51f.js";import{C as N}from"./Card-BVSYF_qe.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";function r({label:c,value:n,colorVar:A}){const d=p.useRef(null);return p.useEffect(()=>{d.current&&E.fromTo(d.current,{innerHTML:0},{innerHTML:n,duration:1.5,snap:{innerHTML:1},ease:"power2.out"})},[n]),o.jsxs(N,{className:"relative p-6",children:[o.jsx("div",{className:"absolute top-4 right-4 w-[28px] h-[28px] border-2 border-ink",style:{backgroundColor:`var(${A})`}}),o.jsx("h3",{className:"text-sm font-bold uppercase mb-2 tracking-wider",children:c}),o.jsx("div",{ref:d,className:"text-5xl font-archivo tabular-nums",children:n})]})}r.__docgenInfo={description:"",methods:[],displayName:"StatCard",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"number"},description:""},colorVar:{required:!0,tsType:{name:"string"},description:""}}};const I={title:"Domain/StatCard",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text"},value:{control:"number"},colorVar:{control:"text"}},decorators:[c=>o.jsx("div",{style:{"--color-open":"#4ade80","--color-prog":"#facc15","--color-done":"#60a5fa","--color-total":"#f472b6"},className:"p-8",children:o.jsx(c,{})})]},e={args:{label:"Abertos",value:12,colorVar:"--color-open"}},a={args:{label:"Em Atendimento",value:5,colorVar:"--color-prog"}},l={args:{label:"Concluídos",value:34,colorVar:"--color-done"}},t={args:{label:"Total",value:51,colorVar:"--color-total"}},s={args:{label:"Total",value:51,colorVar:"--color-total"},render:()=>o.jsxs("div",{style:{"--color-open":"#4ade80","--color-prog":"#facc15","--color-done":"#60a5fa","--color-total":"#f472b6"},className:"grid grid-cols-2 gap-4 p-8",children:[o.jsx(r,{label:"Total",value:51,colorVar:"--color-total"}),o.jsx(r,{label:"Abertos",value:12,colorVar:"--color-open"}),o.jsx(r,{label:"Em Atendimento",value:5,colorVar:"--color-prog"}),o.jsx(r,{label:"Concluídos",value:34,colorVar:"--color-done"})]})};var i,m,u;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    label: "Abertos",
    value: 12,
    colorVar: "--color-open"
  }
}`,...(u=(m=e.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,b,v;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Em Atendimento",
    value: 5,
    colorVar: "--color-prog"
  }
}`,...(v=(b=a.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var f,x,C;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: "Concluídos",
    value: 34,
    colorVar: "--color-done"
  }
}`,...(C=(x=l.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var V,S,T;t.parameters={...t.parameters,docs:{...(V=t.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: "Total",
    value: 51,
    colorVar: "--color-total"
  }
}`,...(T=(S=t.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var j,h,y;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Total",
    value: 51,
    colorVar: "--color-total"
  },
  render: () => <div style={{
    "--color-open": "#4ade80",
    "--color-prog": "#facc15",
    "--color-done": "#60a5fa",
    "--color-total": "#f472b6"
  } as React.CSSProperties} className="grid grid-cols-2 gap-4 p-8">
      <StatCard label="Total" value={51} colorVar="--color-total" />
      <StatCard label="Abertos" value={12} colorVar="--color-open" />
      <StatCard label="Em Atendimento" value={5} colorVar="--color-prog" />
      <StatCard label="Concluídos" value={34} colorVar="--color-done" />
    </div>
}`,...(y=(h=s.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};const L=["Open","InProgress","Completed","Total","AllCards"];export{s as AllCards,l as Completed,a as InProgress,e as Open,t as Total,L as __namedExportsOrder,I as default};
