import "./globals.css";
import Link from "next/link";
export const metadata={title:"Israelysis – Global Currency Converter with Live Exchange Rates",description:"Convert between world currencies using live exchange rates and view historical charts.",openGraph:{title:"Israelysis",description:"Convert Currencies. Understand Global Value.",type:"website"}};
const ld={"@context":"https://schema.org","@type":"WebApplication",name:"Israelysis",applicationCategory:"FinanceApplication",description:"Live currency converter with historical charts"};
const L=[["/","Converter"],["/currencies","Currencies"],["/countries","Countries"],["/about","About"],["/contact","Contact"]];
export default function R({children}:{children:React.ReactNode}){return <html lang="en"><body>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
  <nav><Link href="/">Israel<span>ysis</span></Link><div className="links">{L.map(([h,t])=><Link key={h} href={h}>{t}</Link>)}</div></nav>
  {children}
  <footer><div>© Israelysis · Rates from ExchangeRate-API and the European Central Bank (via Frankfurter). Indicative only.</div><div className="links">{L.map(([h,t])=><Link key={h} href={h}>{t}</Link>)}</div></footer>
  </body></html>}
