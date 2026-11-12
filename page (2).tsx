"use client";
import {useEffect,useMemo,useState} from "react";
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer} from "recharts";
import {PAIRS} from "@/lib/data";
import Combo from "@/components/Combo";

const rn=new Intl.DisplayNames(["en"],{type:"region"}),cn=new Intl.DisplayNames(["en"],{type:"currency"});
const flag=(c:string)=>String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0)));
const COUNTRIES=Object.entries(PAIRS).map(([code,cur])=>({code,cur,name:rn.of(code)||code})).sort((a,b)=>a.name.localeCompare(b.name));
const money=(n:number,c:string)=>{try{return new Intl.NumberFormat("en",{style:"currency",currency:c}).format(n)}catch{return `${n} ${c}`}};
const POP=["USD:EUR","USD:GBP","USD:NGN","EUR:USD","GBP:NGN","USD:CAD","USD:JPY","EUR:GBP","NGN:USD"];
const countryFor=(cur:string)=>COUNTRIES.find(c=>c.cur===cur)?.code||"US";

export default function Home(){
  const [s,setS]=useState({fc:"US",fcur:"USD",tc:"DE",tcur:"EUR",amt:"2,000"});
  const [rates,setRates]=useState<{rates:Record<string,number>;updated:string}|null>(null);
  const [err,setErr]=useState("");const [loading,setLoading]=useState(true);
  const [days,setDays]=useState(30);const [hist,setHist]=useState<any[]>([]);const [herr,setHerr]=useState("");
  const [copied,setCopied]=useState(false);

  useEffect(()=>{try{const v=localStorage.getItem("isr");if(v)setS(JSON.parse(v))}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem("isr",JSON.stringify(s))}catch{}},[s]);
  useEffect(()=>{
    let live=true;setLoading(true);setErr("");
    const load=()=>fetch(`/api/rates?base=${s.fcur}`).then(async r=>{const d=await r.json();if(!live)return;
      if(!r.ok){setErr(d.error);setRates(null)}else setRates(d)}).catch(()=>live&&setErr("Network error.")).finally(()=>live&&setLoading(false));
    load();const t=setInterval(load,10*60*1000);return()=>{live=false;clearInterval(t)};
  },[s.fcur]);
  useEffect(()=>{setHerr("");fetch(`/api/history?from=${s.fcur}&to=${s.tcur}&days=${days}`).then(async r=>{const d=await r.json();
    if(!r.ok){setHist([]);setHerr(d.error)}else setHist(d.series)}).catch(()=>setHerr("Network error."))},[s.fcur,s.tcur,days]);

  const num=parseFloat(s.amt.replace(/,/g,""))||0;
  const rate=rates?.rates[s.tcur];
  const out=rate!=null?num*rate:null;
  const text=out!=null?`${money(num,s.fcur)} = ${money(out,s.tcur)} (1 ${s.fcur} = ${rate} ${s.tcur})`:"";
  const allCur=useMemo(()=>Array.from(new Set([...Object.values(PAIRS),...Object.keys(rates?.rates||{})])).sort(),[rates]);
  const set=(p:Partial<typeof s>)=>setS(x=>({...x,...p}));
  const swap=()=>setS(x=>({...x,fc:x.tc,fcur:x.tcur,tc:x.fc,tcur:x.fcur}));
  const fmtAmt=(v:string)=>{const c=v.replace(/[^\d.]/g,"");const [i,...d]=c.split(".");return (Number(i||0)).toLocaleString("en")+(d.length?"."+d.join("").slice(0,6):"")};

  const cOpts=COUNTRIES.map(c=>({v:c.code,t:`${flag(c.code)} ${c.name}`}));
  const uOpts=allCur.map(c=>({v:c,t:`${c} – ${cn.of(c)}`}));
  const side=(k:"f"|"t",title:string)=>{const cc=k==="f"?s.fc:s.tc,cur=k==="f"?s.fcur:s.tcur;
    return <div><Combo label={title+" country"} value={cc} options={cOpts} onChange={v=>set(k==="f"?{fc:v,fcur:PAIRS[v]}:{tc:v,tcur:PAIRS[v]})}/>
      <Combo label="Currency" value={cur} options={uOpts} onChange={v=>set(k==="f"?{fcur:v}:{tcur:v})}/></div>};

  return <>
  <main><h1>Convert Currencies. Understand Global Value.</h1>
  <p className="sub">Live exchange rates for 160+ currencies, with historical charts.</p>
  <section className="card" aria-label="Currency converter">
    <label htmlFor="amt">Amount</label>
    <input id="amt" inputMode="decimal" value={s.amt} onChange={e=>set({amt:fmtAmt(e.target.value)})}/>
    <div className="row">{side("f","From")}<button className="swap" onClick={swap} aria-label="Swap currencies">⇄</button>{side("t","To")}</div>
    {loading&&<p className="muted">Loading live rate…</p>}
    {err&&<p className="err" role="alert">{err}</p>}
    {out!=null&&!err&&<><div className="res">{money(num,s.fcur)} → {money(out,s.tcur)}</div>
      <p className="muted">1 {s.fcur} = {rate} {s.tcur} · 1 {s.tcur} = {(1/rate!).toPrecision(6)} {s.fcur}<br/>Updated: {rates?.updated} · Source: ExchangeRate-API (open.er-api.com)</p>
      <button onClick={()=>{navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1500)}}>{copied?"Copied ✓":"Copy result"}</button></>}
    {rates&&rate==null&&!err&&<p className="err">{s.tcur} is not supported by the rate provider.</p>}
  </section>
  <section className="card"><h2>Popular conversions</h2><div className="pop">
    {POP.map(p=>{const [a,b]=p.split(":");return <button key={p} onClick={()=>setS(x=>({...x,fcur:a,fc:countryFor(a),tcur:b,tc:countryFor(b)}))}>{a} → {b}</button>})}</div></section>
  <section className="card"><h2>{s.fcur}/{s.tcur} history</h2>
    <div className="tabs">{[7,30,90,365].map(d=><button key={d} className={d===days?"on":""} onClick={()=>setDays(d)}>{d===365?"1Y":d+"D"}</button>)}</div>
    {herr?<p className="muted">{herr}</p>:<div style={{height:280,marginTop:12}}><ResponsiveContainer><LineChart data={hist}>
      <XAxis dataKey="date" tick={{fontSize:11}} minTickGap={40}/><YAxis domain={["auto","auto"]} width={60}/><Tooltip/>
      <Line type="monotone" dataKey="rate" stroke="#3b82f6" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></div>}
    <p className="muted">Source: Frankfurter (European Central Bank reference rates, business days).</p></section>
  </main></>}
