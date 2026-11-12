import Directory from "@/components/Directory";
export const metadata={title:"Currency Directory – ISO 4217 Codes & Symbols | Israelysis",description:"Search world currencies by name, code or symbol."};
export default function P(){
  const names=new Intl.DisplayNames(["en"],{type:"currency"});
  const sym=(c:string)=>new Intl.NumberFormat("en",{style:"currency",currency:c,currencyDisplay:"narrowSymbol"}).formatToParts(0).find(p=>p.type==="currency")?.value||c;
  const rows=Intl.supportedValuesOf("currency").map(c=>[c,names.of(c)||c,sym(c)]);
  return <main><h1>Currency Directory</h1><Directory head={["Code","Name","Symbol"]} rows={rows} ph="Search by name, code or symbol"/></main>}
