const B=process.env.NEXT_PUBLIC_SITE_URL||"https://israelysis.vercel.app";
const P=["usd-to-eur","usd-to-gbp","usd-to-ngn","eur-to-usd","gbp-to-ngn","usd-to-cad","usd-to-jpy","eur-to-gbp","ngn-to-usd"];
export default function sitemap(){return [...["","/currencies","/countries","/about","/contact"],...P.map(p=>"/convert/"+p)].map(u=>({url:B+u}))}
