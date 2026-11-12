// Live rates: open.er-api.com (no key, ~160 currencies, hourly cache). Attribution to exchangerate-api.com is required by its terms.
export async function GET(r:Request){
  const base=(new URL(r.url).searchParams.get("base")||"").toUpperCase();
  if(!/^[A-Z]{3}$/.test(base))return Response.json({error:"Invalid base currency"},{status:400});
  try{
    const res=await fetch(`https://open.er-api.com/v6/latest/${base}`,{next:{revalidate:3600}});
    const d=await res.json();
    if(d.result!=="success")return Response.json({error:`Currency ${base} is not supported by the rate provider`},{status:404});
    return Response.json({base,rates:d.rates,updated:d.time_last_update_utc,source:"open.er-api.com"});
  }catch{return Response.json({error:"Exchange-rate provider unavailable. No rate is shown rather than a guessed one."},{status:502});}
}
