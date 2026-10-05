import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{c as A}from"./utils-BOzF_IbP.js";import"./index-Bc2G9s8g.js";import"./clsx-B-dksMZM.js";function a({className:T,variant:x="default",...D}){return e.jsx("div",{className:A("badge",x,T),...D})}a.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{variant:{required:!1,tsType:{name:"union",raw:"'open' | 'prog' | 'done' | 'default'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'prog'"},{name:"literal",value:"'done'"},{name:"literal",value:"'default'"}]},description:"",defaultValue:{value:"'default'",computed:!1}}}};const R={title:"UI/Badge",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","open","prog","done"]},children:{control:"text"}}},r={args:{children:"Badge",variant:"default"}},n={args:{children:"ABERTO",variant:"open"}},s={args:{children:"EM ATENDIMENTO",variant:"prog"}},o={args:{children:"CONCLUÍDO",variant:"done"}},t={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx(a,{variant:"open",children:"ABERTO"}),e.jsx(a,{variant:"prog",children:"EM ATENDIMENTO"}),e.jsx(a,{variant:"done",children:"CONCLUÍDO"})]})};var d,c,i;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "Badge",
    variant: "default"
  }
}`,...(i=(c=r.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var l,p,m;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: "ABERTO",
    variant: "open"
  }
}`,...(m=(p=n.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,g,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: "EM ATENDIMENTO",
    variant: "prog"
  }
}`,...(v=(g=s.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,O,E;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: "CONCLUÍDO",
    variant: "done"
  }
}`,...(E=(O=o.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var N,B,h;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Badge variant="open">ABERTO</Badge>
      <Badge variant="prog">EM ATENDIMENTO</Badge>
      <Badge variant="done">CONCLUÍDO</Badge>
    </div>
}`,...(h=(B=t.parameters)==null?void 0:B.docs)==null?void 0:h.source}}};const S=["Default","Open","InProgress","Done","AllVariants"];export{t as AllVariants,r as Default,o as Done,s as InProgress,n as Open,S as __namedExportsOrder,R as default};
