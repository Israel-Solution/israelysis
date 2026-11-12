"use client";
import {useState} from "react";
type O={v:string;t:string};
export default function Combo({label,value,options,onChange}:{label:string;value:string;options:O[];onChange:(v:string)=>void}){
  const [open,setOpen]=useState(false),[q,setQ]=useState("");
  const cur=options.find(o=>o.v===value);
  const list=options.filter(o=>o.t.toLowerCase().includes(q.toLowerCase())).slice(0,80);
  const pick=(v:string)=>{onChange(v);setOpen(false)};
  return <div className="combo"><label>{label}</label>
    <button type="button" className="cb" aria-haspopup="listbox" aria-expanded={open} onClick={()=>{setOpen(!open);setQ("")}}>{cur?.t||value} ▾</button>
    {open&&<div className="panel"><input autoFocus placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}
      onKeyDown={e=>{if(e.key==="Escape")setOpen(false);if(e.key==="Enter"&&list[0])pick(list[0].v)}}/>
      <ul role="listbox">{list.map(o=><li key={o.v} role="option" aria-selected={o.v===value} tabIndex={0} onClick={()=>pick(o.v)} onKeyDown={e=>{if(e.key==="Enter")pick(o.v)}}>{o.t}</li>)}
      {!list.length&&<li className="muted">No matches</li>}</ul></div>}</div>}
