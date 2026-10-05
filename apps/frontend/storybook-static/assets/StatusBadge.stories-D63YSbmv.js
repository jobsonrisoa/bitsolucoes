import{j as s}from"./jsx-runtime-DFAAy_2V.js";import{S as o}from"./StatusBadge-CF4bR0-y.js";import"./index-Bc2G9s8g.js";import"./clsx-B-dksMZM.js";const C={title:"Domain/StatusBadge",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["OPEN","IN_PROGRESS","COMPLETED"]}}},a={args:{status:"OPEN"}},t={args:{status:"IN_PROGRESS"}},e={args:{status:"COMPLETED"}},r={args:{status:"OPEN"},render:()=>s.jsxs("div",{className:"flex gap-4",children:[s.jsx(o,{status:"OPEN"}),s.jsx(o,{status:"IN_PROGRESS"}),s.jsx(o,{status:"COMPLETED"})]})};var n,c,u;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    status: "OPEN"
  }
}`,...(u=(c=a.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var p,m,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    status: "IN_PROGRESS"
  }
}`,...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var E,g,S;e.parameters={...e.parameters,docs:{...(E=e.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    status: "COMPLETED"
  }
}`,...(S=(g=e.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var i,l,O;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    status: "OPEN"
  },
  render: () => <div className="flex gap-4">
      <StatusBadge status="OPEN" />
      <StatusBadge status="IN_PROGRESS" />
      <StatusBadge status="COMPLETED" />
    </div>
}`,...(O=(l=r.parameters)==null?void 0:l.docs)==null?void 0:O.source}}};const I=["Open","InProgress","Completed","AllStatuses"];export{r as AllStatuses,e as Completed,t as InProgress,a as Open,I as __namedExportsOrder,C as default};
