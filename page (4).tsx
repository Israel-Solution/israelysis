import Directory from "@/components/Directory";
import {PAIRS} from "@/lib/data";
export const metadata={title:"Country Directory – Flags & Currencies | Israelysis",description:"Search countries and the currencies they use."};
export default function P(){
  const rn=new Intl.DisplayNames(["en"],{type:"region"}),cn=new Intl.DisplayNames(["en"],{type:"currency"});
  const flag=(c:string)=>String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0)));
  const rows=Object.entries(PAIRS).map(([c,u])=>[`${flag(c)} ${rn.of(c)}`,c,u,cn.of(u)||u]).sort((a,b)=>a[0].localeCompare(b[0]));
  return <main><h1>Country Directory</h1><Directory head={["Country","ISO","Currency","Name"]} rows={rows} ph="Search country or currency"/></main>}
