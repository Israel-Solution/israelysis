"use client";
import {useState} from "react";
const EMAIL="YOUR-EMAIL@EXAMPLE.COM"; // <-- put your real email here
export default function P(){
  const [f,setF]=useState({name:"",email:"",msg:""});
  const go=(e:React.FormEvent)=>{e.preventDefault();location.href=`mailto:${EMAIL}?subject=${encodeURIComponent("Israelysis contact from "+f.name)}&body=${encodeURIComponent(f.msg+"\n\nFrom: "+f.name+" <"+f.email+">")}`};
  return <main><h1>Contact</h1><form className="card" onSubmit={go}>
    <label htmlFor="n">Name</label><input id="n" required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
    <label htmlFor="e">Email</label><input id="e" type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
    <label htmlFor="m">Message</label><textarea id="m" required rows={5} value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #cbd5e1"}}/>
    <p><button type="submit">Send message</button></p></form></main>}
