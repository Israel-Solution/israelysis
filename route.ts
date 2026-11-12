// History: Frankfurter (ECB reference rates). Covers ~30 major currencies only; others return an honest 404.
export async function GET(r:Request){
  const p=new URL(r.url).searchParams,from=(p.get("from")||"").toUpperCase(),to=(p.get("to")||"").toUpperCase();
  const days=Math.min(Math.max(parseInt(p.get("days")||"30"),1),1825);
  if(!/^[A-Z]{3}$/.test(from)||!/^[A-Z]{3}$/.test(to))return Response.json({error:"Invalid currency"},{status:400});
  const end=new Date(),start=new Date(Date.now()-days*864e5),f=(d:Date)=>d.toISOString().slice(0,10);
  try{
    const res=await fetch(`https://api.frankfurter.dev/v1/${f(start)}..${f(end)}?base=${from}&symbols=${to}`,{next:{revalidate:21600}});
    if(!res.ok)return Response.json({error:`Historical data isn't available for ${from}/${to} (provider covers ECB currencies only).`},{status:404});
    const d=await res.json();
    return Response.json({series:Object.entries(d.rates).map(([date,v]:any)=>({date,rate:v[to]})),source:"frankfurter.dev (ECB)"});
  }catch{return Response.json({error:"History provider unavailable."},{status:502});}
}
