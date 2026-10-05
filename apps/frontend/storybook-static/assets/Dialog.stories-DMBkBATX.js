import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as p}from"./index-Bc2G9s8g.js";import{B as n}from"./Button-vSxIRSr7.js";import{D as i}from"./Dialog-CvWLUrFO.js";import"./utils-BOzF_IbP.js";import"./clsx-B-dksMZM.js";const g={title:"UI/Dialog",component:i,tags:["autodocs"]},o={render:()=>{const[l,t]=p.useState(!0);return e.jsxs("div",{children:[e.jsx(n,{onClick:()=>t(!0),children:"Abrir modal"}),e.jsxs(i,{open:l,onOpenChange:t,children:[e.jsx("h2",{className:"font-archivo text-2xl",children:"Confirmar ação"}),e.jsx("p",{children:"Este modal usa o dialog base do Átrio."}),e.jsx(n,{onClick:()=>t(!1),children:"Fechar"})]})]})}};var r,a,s;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(true);
    return <div>
        <Button onClick={() => setOpen(true)}>Abrir modal</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <h2 className="font-archivo text-2xl">Confirmar ação</h2>
          <p>Este modal usa o dialog base do Átrio.</p>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </Dialog>
      </div>;
  }
}`,...(s=(a=o.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const f=["OpenDialog"];export{o as OpenDialog,f as __namedExportsOrder,g as default};
