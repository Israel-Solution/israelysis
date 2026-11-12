import Link from "next/link";
export const revalidate=3600;
const parse=(p:string)=>p.toUpperCase().split("-TO-");
export async function generateMetadata({params}:{params:Promise<{pair:string}>}){
  const [a,b]=parse((await params).pair);
  return {title:`${a} to ${b} – Live ${a}/${b} Exchange Rate | Israelysis`,description:`Convert ${a} to ${b} using the latest exchange rate, with quick conversion amounts.`};}
export default async function P({params}:{params:Promise<{pair:string}>}){
  const [a,b]=parse((await params).pair);
  let rate:number|undefined,updated="";
  try{const r=await fetch(`https://open.er-api.com/v6/latest/${a}`,{next:{revalidate:3600}});const d=await r.json();
    if(d.result==="success"){rate=d.rates[b];updated=d.time_last_update_utc}}catch{}
  const fmt=(n:number,c:string)=>{try{return new Intl.NumberFormat("en",{style:"currency",currency:c}).format(n)}catch{return `${n} ${c}`}};
  return <main><h1>{a} to {b}</h1>
    {rate==null?<div className="card"><p className="err">Live rate for {a}/{b} is unavailable right now or this pair is unsupported.</p></div>:
    <div className="card"><div className="res">1 {a} = {rate} {b}</div><p className="muted">Updated: {updated} · Source: ExchangeRate-API</p>
      <table><thead><tr><th>{a}</th><th>{b}</th></tr></thead><tbody>{[1,10,100,1000,10000].map(n=><tr key={n}><td>{fmt(n,a)}</td><td>{fmt(n*rate!,b)}</td></tr>)}</tbody></table>
      <p><Link href="/"><button>Open full converter</button></Link></p></div>}</main>}
