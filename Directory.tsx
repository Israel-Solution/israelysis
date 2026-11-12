"use client";
import {useState} from "react";
export default function Directory({head,rows,ph}:{head:string[];rows:string[][];ph:string}){
  const [q,setQ]=useState("");const f=rows.filter(r=>r.join(" ").toLowerCase().includes(q.toLowerCase()));
  return <div className="card"><input placeholder={ph} value={q} onChange={e=>setQ(e.target.value)} aria-label={ph}/>
    <p className="muted">{f.length} results</p>
    <div style={{overflowX:"auto"}}><table><thead><tr>{head.map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{f.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div></div>}
