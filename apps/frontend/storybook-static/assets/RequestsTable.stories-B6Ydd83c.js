import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as h}from"./index-Bc2G9s8g.js";import{L as P}from"./next-link-T-cyJIgg.js";import{g as w}from"./index-CcQw-51f.js";import{T as O,a as q,b,c as E,d as L,e as r}from"./Table-Dumzc6NL.js";import{S as Z}from"./StatusBadge-CF4bR0-y.js";import{C as k}from"./CategoryTag-Dg42F836.js";import{B as x}from"./Button-vSxIRSr7.js";import{T as v}from"./Tooltip-DoE-fv8c.js";import{C as B,a as y,b as D,c as _}from"./chevron-up-DUxbDE7Q.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const z=[{field:"id",label:"Código"},{field:"title",label:"Título"},{field:"category",label:"Categoria"},{field:"requesterId",label:"Solicitante"},{field:"createdAt",label:"Data de abertura"},{field:"status",label:"Status"}];function N({data:t,onPageChange:o,onSortChange:I,sortBy:l,sortOrder:d}){var m,p,g,f;const s=h.useRef(null);h.useEffect(()=>{if(s.current&&t.data.length>0){const a=s.current.children;w.fromTo(a,{opacity:0,y:20},{opacity:1,y:0,stagger:.1,duration:.4,ease:"power2.out"})}},[t.data]);const n=t.page??((m=t.meta)==null?void 0:m.page)??1,A=t.total??((p=t.meta)==null?void 0:p.total)??0,C=t.pageSize??((g=t.meta)==null?void 0:g.limit)??10,c=((f=t.meta)==null?void 0:f.totalPages)??(Math.ceil(A/C)||1),u=a=>a.startsWith("SOL-")?a:`SOL-${a.padStart(6,"0")}`,R=d==="asc"?B:y;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs(O,{children:[e.jsx(q,{children:e.jsx(b,{children:z.map(a=>e.jsx(E,{"aria-sort":l===a.field?d==="asc"?"ascending":"descending":"none",children:e.jsxs("button",{type:"button",onClick:()=>I(a.field),title:`Ordenar por ${a.label}`,className:"inline-flex h-10 items-center gap-1 font-archivo hover:underline hover:decoration-2 hover:underline-offset-4",children:[a.label,l===a.field?e.jsx(R,{className:"h-4 w-4","aria-hidden":"true"}):e.jsx(y,{className:"h-4 w-4 opacity-35","aria-hidden":"true"})]})},a.field))})}),e.jsx(L,{ref:s,children:t.data.map(a=>e.jsxs(b,{className:"cursor-pointer group relative",children:[e.jsxs(r,{className:"font-ibm",children:[e.jsx(P,{href:`/lista/${a.id}`,className:"absolute inset-0 z-10","aria-label":`Abrir solicitação ${u(a.id)}: ${a.title}`}),u(a.id)]}),e.jsx(r,{className:"font-bold group-hover:underline",children:a.title}),e.jsx(r,{children:e.jsx(k,{category:a.category})}),e.jsx(r,{children:a.requesterId??"-"}),e.jsx(r,{children:new Date(a.createdAt).toLocaleDateString("pt-BR")}),e.jsx(r,{children:e.jsx(Z,{status:a.status})})]},a.id))})]}),e.jsxs("div",{className:"flex justify-between items-center bg-paper border-2 border-ink p-4",children:[e.jsxs("span",{className:"font-bold",children:["Página ",n," de ",c]}),e.jsxs("div",{className:"flex gap-2",children:[n>1?e.jsx(v,{label:"Página anterior",children:e.jsx(x,{variant:"outline",onClick:()=>o(n-1),"aria-label":"Página anterior",title:"Página anterior",children:e.jsx(D,{className:"h-4 w-4","aria-hidden":"true"})})}):null,n<c?e.jsx(v,{label:"Próxima página",children:e.jsx(x,{variant:"outline",onClick:()=>o(n+1),"aria-label":"Próxima página",title:"Próxima página",children:e.jsx(_,{className:"h-4 w-4","aria-hidden":"true"})})}):null]})]})]})}N.__docgenInfo={description:"",methods:[],displayName:"RequestsTable",props:{data:{required:!0,tsType:{name:"PaginatedResponse",elements:[{name:"RequestItem"}],raw:"PaginatedResponse<RequestItem>"},description:""},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:""},sortBy:{required:!0,tsType:{name:"union",raw:'"id" | "title" | "category" | "requesterId" | "createdAt" | "status"',elements:[{name:"literal",value:'"id"'},{name:"literal",value:'"title"'},{name:"literal",value:'"category"'},{name:"literal",value:'"requesterId"'},{name:"literal",value:'"createdAt"'},{name:"literal",value:'"status"'}]},description:""},sortOrder:{required:!0,tsType:{name:"union",raw:'"asc" | "desc"',elements:[{name:"literal",value:'"asc"'},{name:"literal",value:'"desc"'}]},description:""},onSortChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(field: SortField) => void",signature:{arguments:[{type:{name:"union",raw:'"id" | "title" | "category" | "requesterId" | "createdAt" | "status"',elements:[{name:"literal",value:'"id"'},{name:"literal",value:'"title"'},{name:"literal",value:'"category"'},{name:"literal",value:'"requesterId"'},{name:"literal",value:'"createdAt"'},{name:"literal",value:'"status"'}]},name:"field"}],return:{name:"void"}}},description:""}}};const Y={title:"Domain/RequestsTable",component:N,tags:["autodocs"]},i={args:{data:{data:[{id:"SOL-000128",title:"Acesso ao sistema financeiro",description:"Liberar perfil financeiro para fechamento mensal.",category:"FINANCEIRO",status:"OPEN",requesterId:1,createdAt:"2026-01-02T10:00:00.000Z",updatedAt:"2026-01-02T10:00:00.000Z"},{id:"129",title:"Notebook para onboarding",description:"Separar equipamento para novo colaborador.",category:"TI",status:"IN_PROGRESS",requesterId:2,createdAt:"2026-01-03T10:00:00.000Z",updatedAt:"2026-01-03T12:00:00.000Z"}],page:1,pageSize:10,total:2},onPageChange:()=>{},onSortChange:()=>{},sortBy:"createdAt",sortOrder:"desc"}};var j,T,S;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    data: {
      data: [{
        id: "SOL-000128",
        title: "Acesso ao sistema financeiro",
        description: "Liberar perfil financeiro para fechamento mensal.",
        category: "FINANCEIRO",
        status: "OPEN",
        requesterId: 1,
        createdAt: "2026-01-02T10:00:00.000Z",
        updatedAt: "2026-01-02T10:00:00.000Z"
      }, {
        id: "129",
        title: "Notebook para onboarding",
        description: "Separar equipamento para novo colaborador.",
        category: "TI",
        status: "IN_PROGRESS",
        requesterId: 2,
        createdAt: "2026-01-03T10:00:00.000Z",
        updatedAt: "2026-01-03T12:00:00.000Z"
      }],
      page: 1,
      pageSize: 10,
      total: 2
    },
    onPageChange: () => undefined,
    onSortChange: () => undefined,
    sortBy: "createdAt",
    sortOrder: "desc"
  }
}`,...(S=(T=i.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};const ee=["Default"];export{i as Default,ee as __namedExportsOrder,Y as default};
