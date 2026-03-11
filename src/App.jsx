import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://vpxoxbnbwdvieplgjtnj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweG94Ym5id2R2aWVwbGdqdG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODk2NzksImV4cCI6MjA4ODc2NTY3OX0.UwZ3d_PK1cqJSetkJp1UZgPRwSk3F-qt-_P88O5xnsE"
);

// ─── Constantes ───────────────────────────────────────────────────────────────
const TEMAS = [
  { nome:"Brasa",     primary:"#C41E3A", dark:"#8b0f24" },
  { nome:"Floresta",  primary:"#2d7a3a", dark:"#1b4d24" },
  { nome:"Oceano",    primary:"#1a3c6e", dark:"#0f2344" },
  { nome:"Por do Sol",primary:"#e8650a", dark:"#b34d07" },
  { nome:"Violeta",   primary:"#6b2fa0", dark:"#481f6d" },
  { nome:"Antracite", primary:"#1e1e2e", dark:"#111118" },
];
const LOGOS = ["🍕","🔥","⭐","🌿","👨‍🍳","🫕","🍽️","🏠","✨","🇮🇹","🌶️","🧑‍🍳","🥩","🧆","🥗"];
const CATS = ["Todos","Pizzas","Combos","Bebidas","Sobremesas"];
const CAT_ICONS = {Todos:"🍽️",Pizzas:"🍕",Combos:"🎁",Bebidas:"🥤",Sobremesas:"🍰"};
const STATUS_LIST = ["Recebido","Em preparo","Saiu p/ entrega","Entregue"];
const STATUS_COLOR = {
  "Recebido":        {bg:"#fff8e1",txt:"#f59e0b"},
  "Em preparo":      {bg:"#e0f2fe",txt:"#0284c7"},
  "Saiu p/ entrega": {bg:"#fff7ed",txt:"#ea580c"},
  "Entregue":        {bg:"#dcfce7",txt:"#16a34a"},
};
const MASTER_USER = "master";
const MASTER_PASS = "SaaS@Master2026!";
const PRODUTOS_PADRAO = [
  {nome:"Margherita Classica",  descricao:"Molho de tomate, mozzarella, manjericao fresco",          preco:42.90, cat:"Pizzas",     emoji:"🍕", badge:"Classica", ativo:true},
  {nome:"Pepperoni Suprema",    descricao:"Molho especial, mozzarella, pepperoni importado",          preco:52.90, cat:"Pizzas",     emoji:"🔥", badge:"Top Venda",ativo:true},
  {nome:"Quatro Queijos",       descricao:"Mozzarella, parmesao, gorgonzola, provolone",              preco:55.90, cat:"Pizzas",     emoji:"🧀", badge:null,       ativo:true},
  {nome:"Frango com Catupiry",  descricao:"Molho branco, frango desfiado, catupiry, milho",           preco:49.90, cat:"Pizzas",     emoji:"🍗", badge:"Favorita", ativo:true},
  {nome:"Calabresa Artesanal",  descricao:"Molho artesanal, calabresa defumada, cebola caramelizada", preco:47.90, cat:"Pizzas",     emoji:"🌶️",badge:null,       ativo:true},
  {nome:"Combo Familia",        descricao:"2 Pizzas grandes + 2 Refrigerantes 2L + Sobremesa",        preco:139.90,cat:"Combos",    emoji:"👨‍👩‍👧‍👦",badge:"Oferta",  ativo:true},
  {nome:"Combo Casal",          descricao:"1 Pizza grande + 1 Pizza pequena + 2 Refrigerantes",       preco:89.90, cat:"Combos",    emoji:"💑", badge:"Popular",  ativo:true},
  {nome:"Coca-Cola 2L",         descricao:"Refrigerante gelado 2 litros",                             preco:14.90, cat:"Bebidas",   emoji:"🥤", badge:null,       ativo:true},
  {nome:"Suco Natural 500ml",   descricao:"Laranja, maracuja ou limao espremido na hora",             preco:12.90, cat:"Bebidas",   emoji:"🍊", badge:"Fresco",   ativo:true},
  {nome:"Tiramisu da Casa",     descricao:"Receita italiana com mascarpone e cafe expresso",          preco:22.90, cat:"Sobremesas",emoji:"🍰", badge:"Especial", ativo:true},
];

// ─── Utils ────────────────────────────────────────────────────────────────────
const R = v => "R$\u00A0" + Number(v).toFixed(2).replace(".",",");
const slugify = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const nowStr = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const dateStr = () => new Date().toLocaleDateString("pt-BR");
const genNum = () => "#" + Math.floor(1000+Math.random()*9000);
const getSlugFromURL = () => { const p = window.location.pathname.replace(/^\/+/,"").split("/")[0]; return p || null; };

// ─── CSS Global ───────────────────────────────────────────────────────────────
function GlobalCSS({ p="#C41E3A", d="#8b0f24" }) {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--p:${p};--d:${d};--cream:#FFF8F0;--ink:#1a1008;--muted:#8a7060;--border:#e8ddd4;--radius:16px}
    body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--ink);-webkit-font-smoothing:antialiased}
    button{font-family:inherit;cursor:pointer;border:none;outline:none}
    input,select,textarea{font-family:inherit;outline:none}
    ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{transform:translateX(110%)}to{transform:translateX(0)}}
    @keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
    @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .fade-up{animation:fadeUp .35s ease both}
    .btn-p{background:var(--p);color:#fff;border-radius:99px;padding:12px 28px;font-weight:600;font-size:15px;transition:all .2s;box-shadow:0 4px 16px color-mix(in srgb,var(--p) 35%,transparent)}
    .btn-p:hover{background:var(--d);transform:translateY(-1px)} .btn-p:disabled{opacity:.6;cursor:not-allowed;transform:none}
    .btn-g{background:transparent;border:1.5px solid var(--border);color:var(--muted);border-radius:99px;padding:10px 22px;font-size:14px;font-weight:500;transition:all .2s}
    .btn-g:hover{border-color:var(--p);color:var(--p)}
    .inp{width:100%;border:1.5px solid var(--border);border-radius:12px;padding:11px 14px;font-size:14px;background:#fff;color:var(--ink);transition:border-color .2s}
    .inp:focus{border-color:var(--p)} .inp::placeholder{color:#b8a898}
    .overlay{position:fixed;inset:0;background:rgba(10,5,0,.5);backdrop-filter:blur(4px);z-index:200}
    .drawer{position:fixed;top:0;right:0;bottom:0;width:min(500px,100vw);background:var(--cream);z-index:201;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.2);animation:slideIn .35s cubic-bezier(.25,.46,.45,.94) both}
    .modal-wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:202;padding:16px}
    .modal{background:#fff;border-radius:24px;padding:32px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;animation:popIn .3s cubic-bezier(.34,1.56,.64,1) both}
    .tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:3px 9px;border-radius:99px;background:color-mix(in srgb,var(--p) 12%,transparent);color:var(--p)}
    .card-hov{transition:transform .2s,box-shadow .2s} .card-hov:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,.1)}
  `}</style>;
}

function LoadingScreen({ dark=false }) {
  return (
    <div style={{minHeight:"100vh",background:dark?"#0f0f1a":"#FFF8F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:20}}>🍕</div>
        <div style={{width:36,height:36,border:"3px solid rgba(196,30,58,.2)",borderTop:"3px solid #C41E3A",borderRadius:"50%",animation:"spin .9s linear infinite",margin:"0 auto"}}/>
      </div>
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div style={{position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",background:"#1a1008",color:"#fff",padding:"11px 22px",borderRadius:99,fontSize:14,fontWeight:500,zIndex:9999,whiteSpace:"nowrap",animation:"toastIn .3s ease both",boxShadow:"0 8px 30px rgba(0,0,0,.3)",display:"flex",alignItems:"center",gap:8}}><span>✓</span> {msg}</div>;
}

// ══════════════════════════════════════════════════════════
// PIZZARIA APP  (usa loja_id = UUID da loja)
// ══════════════════════════════════════════════════════════
function PizzariaApp({ loja: lojaInit }) {
  const [loja, setLoja] = useState(lojaInit);
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cat, setCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);

  const tema = TEMAS.find(t => t.nome === loja.tema) || TEMAS[0];

  useEffect(() => {
    document.documentElement.style.setProperty("--p", tema.primary);
    document.documentElement.style.setProperty("--d", tema.dark);
    document.title = loja.nome;
  }, [tema, loja.nome]);

  useEffect(() => { loadData(); }, [loja.id]);

  const loadData = async () => {
    setLoading(true);
    // Busca produtos e pedidos pelo loja_id (UUID)
    const [{ data: prods }, { data: peds }] = await Promise.all([
      supabase.from("produtos").select("*").eq("loja_id", loja.id).order("created_at"),
      supabase.from("pedidos").select("*").eq("loja_id", loja.id).order("created_at", { ascending: false }),
    ]);
    setProdutos(prods && prods.length > 0 ? prods : PRODUTOS_PADRAO.map((p,i) => ({...p, id: String(i+1)})));
    setPedidos(peds || []);
    setLoading(false);
  };

  // ── Produto CRUD ──
  const saveProduto = async (form, editProd) => {
    const row = { loja_id:loja.id, nome:form.nome, descricao:form.descricao, preco:parseFloat(form.preco)||0, cat:form.cat, emoji:form.emoji, badge:form.badge||null, ativo:true };
    if (editProd && editProd.id && !String(editProd.id).match(/^\d+$/)) {
      await supabase.from("produtos").update(row).eq("id", editProd.id);
    } else {
      await supabase.from("produtos").insert([row]);
    }
    await loadData();
  };
  const deleteProduto = async (id) => { await supabase.from("produtos").delete().eq("id", id); setProdutos(ps => ps.filter(x => x.id !== id)); };
  const toggleProduto = async (id, ativo) => { await supabase.from("produtos").update({ativo:!ativo}).eq("id", id); setProdutos(ps => ps.map(x => x.id === id ? {...x, ativo:!x.ativo} : x)); };

  // ── Pedido ──
  const confirmPedido = async (ped) => {
    await supabase.from("pedidos").insert([{
      loja_id: loja.id,
      numero: ped.numero,
      nome: ped.nome,
      tel: ped.tel,
      rua: ped.rua,
      num: ped.num,
      bairro: ped.bairro,
      cidade: ped.cidade || "",
      comp: ped.comp || "",
      pgto: ped.pgto,
      itens: ped.itens,
      total: ped.total,
      status: "Recebido",
      horario: ped.horario,
      data: ped.data,
    }]);
    setCart([]);
    await loadData();
  };
  const updateStatus = async (numero, status) => {
    await supabase.from("pedidos").update({status}).eq("numero", numero).eq("loja_id", loja.id);
    setPedidos(ps => ps.map(p => p.numero === numero ? {...p, status} : p));
  };

  // ── Marca ──
  const saveMarca = async (nm) => {
    await supabase.from("lojas").update({ nome:nm.nome, logo:nm.logo, tagline:nm.tagline, pix:nm.pix, tema:nm.tema?.nome||"Brasa" }).eq("id", loja.id);
    setLoja(l => ({...l, nome:nm.nome, logo:nm.logo, tagline:nm.tagline, pix:nm.pix, tema:nm.tema?.nome||"Brasa"}));
  };

  // ── Cart ──
  const addToCart = useCallback((prod) => {
    setCart(c => { const ex = c.find(x => x.id === prod.id); return ex ? c.map(x => x.id === prod.id ? {...x, qty:x.qty+1} : x) : [...c, {...prod, qty:1}]; });
    setToast(prod.emoji + " " + prod.nome + " adicionado!");
  }, []);
  const updateCart = (id, delta) => setCart(c => c.map(x => x.id === id ? {...x, qty:x.qty+delta} : x).filter(x => x.qty > 0));
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const filtered = produtos.filter(p => {
    if (!p.ativo) return false;
    if (cat !== "Todos" && p.cat !== cat) return false;
    if (search) { const q = search.toLowerCase(); return p.nome.toLowerCase().includes(q) || (p.descricao||"").toLowerCase().includes(q); }
    return true;
  });

  if (loading) return <LoadingScreen/>;

  return (
    <>
      <GlobalCSS p={tema.primary} d={tema.dark}/>
      {/* Navbar */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:tema.primary,boxShadow:"0 2px 20px rgba(0,0,0,.2)"}}>
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px",height:62,display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setShowLogin(true)} style={{background:"none",display:"flex",alignItems:"center",gap:8,flexShrink:0,padding:"4px 0"}}>
            <span style={{fontSize:26}}>{loja.logo}</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#FFF8F0"}}>{loja.nome}</span>
          </button>
          <div style={{flex:1,position:"relative"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:"100%",padding:"8px 14px 8px 36px",borderRadius:99,border:"none",background:"rgba(255,255,255,.18)",color:"#fff",fontSize:14}}/>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:.7}}>🔍</span>
          </div>
          <button onClick={()=>setShowCart(true)} style={{background:"rgba(255,255,255,.18)",border:"2px solid rgba(255,255,255,.3)",borderRadius:99,padding:"8px 16px",color:"#fff",fontWeight:600,fontSize:14,flexShrink:0,display:"flex",alignItems:"center",gap:7}}>
            🛒 {cartCount > 0 && <span style={{background:"#fff",color:tema.primary,borderRadius:99,padding:"1px 8px",fontSize:12,fontWeight:700}}>{cartCount}</span>}
          </button>
        </div>
      </nav>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,"+tema.primary+","+tema.dark+")",padding:"52px 20px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,.08)",top:-80,right:-60,pointerEvents:"none"}}/>
        <div style={{maxWidth:640,margin:"0 auto",position:"relative"}}>
          <div style={{fontSize:56,marginBottom:14}}>{loja.logo||"🍕"}</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(30px,6vw,50px)",color:"#FFF8F0",lineHeight:1.15,marginBottom:12}}>{loja.nome}</h1>
          <p style={{color:"rgba(255,248,240,.75)",fontSize:16,lineHeight:1.6,marginBottom:24,maxWidth:440,margin:"0 auto 24px"}}>{loja.tagline||"Pizzas artesanais quentinhas na sua porta"}</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["🕐 40-60 min","🚀 Entrega rapida","⭐ 4.9 avaliacao"].map(tag => (
              <span key={tag} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:99,padding:"6px 14px",color:"#FFF8F0",fontSize:12,fontWeight:500}}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Categorias */}
      <div style={{background:"#fff",borderBottom:"1px solid var(--border)",position:"sticky",top:62,zIndex:90,overflowX:"auto"}}>
        <div style={{display:"flex",gap:6,padding:"10px 20px",maxWidth:960,margin:"0 auto",minWidth:"max-content"}}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)} style={{padding:"8px 18px",borderRadius:99,border:"2px solid "+(cat===c?"var(--p)":"transparent"),background:cat===c?"var(--p)":"#f5f0eb",color:cat===c?"#fff":"var(--muted)",fontWeight:cat===c?600:400,fontSize:14,transition:"all .2s",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
              {CAT_ICONS[c]} {c}
            </button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <main style={{maxWidth:960,margin:"0 auto",padding:"28px 20px 100px"}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px 0",color:"var(--muted)"}}><div style={{fontSize:52,marginBottom:12}}>🔍</div><p style={{fontSize:16,fontWeight:600}}>Nenhum produto encontrado</p></div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:18}}>
            {filtered.map((p,i) => (
              <div key={p.id} className="fade-up card-hov" style={{animationDelay:i*25+"ms",background:"#fff",borderRadius:"var(--radius)",border:"1px solid var(--border)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
                <div style={{background:"linear-gradient(135deg,color-mix(in srgb,var(--p) 8%,#fff8f0),#fff8f0)",padding:"26px 20px",textAlign:"center",fontSize:48,lineHeight:1}}>{p.emoji}</div>
                <div style={{padding:"14px 16px 16px",flex:1,display:"flex",flexDirection:"column",gap:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,lineHeight:1.3,flex:1}}>{p.nome}</h3>
                    {p.badge && <span className="tag">{p.badge}</span>}
                  </div>
                  <p style={{color:"var(--muted)",fontSize:12,lineHeight:1.5,flex:1}}>{p.descricao}</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:21,color:"var(--p)"}}>{R(p.preco)}</span>
                    <button onClick={()=>addToCart(p)} style={{background:"var(--p)",color:"#fff",borderRadius:99,width:36,height:36,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px color-mix(in srgb,var(--p) 35%,transparent)"}}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* FAB Admin */}
      <button onClick={()=>loggedIn?setShowAdmin(true):setShowLogin(true)} style={{position:"fixed",bottom:24,right:24,background:"#1a1008",color:"#fff",borderRadius:99,padding:"10px 16px",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.3)",zIndex:50,opacity:.7,transition:"opacity .2s"}}
        onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".7"}>
        ⚙️ Admin
      </button>
      {/* Cart Drawer */}
      {showCart && (
        <>
          <div className="overlay" onClick={()=>setShowCart(false)}/>
          <div className="drawer">
            <div style={{padding:"18px 22px",background:tema.primary,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,color:"#FFF8F0"}}>🛒 Carrinho</h2><p style={{color:"rgba(255,248,240,.65)",fontSize:12,marginTop:2}}>{cart.length===0?"Vazio":cartCount+" itens"}</p></div>
              <button onClick={()=>setShowCart(false)} style={{background:"rgba(255,255,255,.2)",borderRadius:99,width:34,height:34,fontSize:17,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 22px"}}>
              {cart.length === 0 ? (
                <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}><div style={{fontSize:48,marginBottom:10}}>🍕</div><p>Carrinho vazio</p></div>
              ) : cart.map(item => (
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:30}}>{item.emoji}</span>
                  <div style={{flex:1}}><p style={{fontWeight:600,fontSize:14}}>{item.nome}</p><p style={{color:"var(--p)",fontWeight:700,fontSize:13,marginTop:2}}>{R(item.preco*item.qty)}</p></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <button onClick={()=>updateCart(item.id,-1)} style={{width:28,height:28,borderRadius:99,border:"1.5px solid var(--border)",background:"#fff",fontSize:15,color:"var(--muted)"}}>−</button>
                    <span style={{fontWeight:700,fontSize:14,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>updateCart(item.id,+1)} style={{width:28,height:28,borderRadius:99,background:"var(--p)",fontSize:15,color:"#fff"}}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{padding:"18px 22px",borderTop:"1px solid var(--border)",background:"#fff"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{color:"var(--muted)",fontSize:13}}>Total</span><span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"var(--p)"}}>{R(cart.reduce((s,i)=>s+i.preco*i.qty,0))}</span></div>
                <button className="btn-p" onClick={()=>{setShowCart(false);setShowCheckout(true);}} style={{width:"100%",padding:"14px"}}>Finalizar pedido →</button>
              </div>
            )}
          </div>
        </>
      )}
      {showCheckout && <CheckoutModal cart={cart} onClose={()=>setShowCheckout(false)} onConfirm={confirmPedido} loja={loja}/>}
      {showLogin && <LoginModal loja={loja} adminPass={loja.admin_pass} onLogin={()=>{setLoggedIn(true);setShowLogin(false);setShowAdmin(true);}} onClose={()=>setShowLogin(false)}/>}
      {showAdmin && <PizzariaAdminPanel onClose={()=>setShowAdmin(false)} pedidos={pedidos} onUpdateStatus={updateStatus} produtos={produtos} onSaveProduto={saveProduto} onDeleteProduto={deleteProduto} onToggleProduto={toggleProduto} loja={loja} onSaveMarca={saveMarca}/>}
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
    </>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
function CheckoutModal({ cart, onClose, onConfirm, loja }) {
  const total = cart.reduce((s,i) => s+i.preco*i.qty, 0);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({nome:"",tel:"",rua:"",num:"",bairro:"",cidade:"",comp:"",pgto:"pix"});
  const [pedNum] = useState(genNum);
  const [saving, setSaving] = useState(false);
  const up = (k,v) => setForm(f => ({...f,[k]:v}));
  const canNext = form.nome && form.tel && form.rua && form.num && form.bairro;
  const confirm = async () => {
    setSaving(true);
    await onConfirm({numero:pedNum, ...form, itens:cart, total, horario:nowStr(), data:dateStr()});
    setSaving(false);
    setStep(3);
  };
  const tema = TEMAS.find(t => t.nome === loja.tema) || TEMAS[0];
  return (
    <>
      <div className="overlay" onClick={onClose}/>
      <div className="modal-wrap">
        <div className="modal">
          {step === 3 ? (
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:56,marginBottom:12}}>🎉</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,marginBottom:6}}>Pedido confirmado!</h2>
              <p style={{color:"var(--muted)",marginBottom:16}}>{pedNum} • {nowStr()}</p>
              {form.pgto === "pix" && loja.pix && (
                <div style={{background:"#f0fdf4",borderRadius:12,padding:"14px",border:"1px solid #bbf7d0",marginBottom:16}}>
                  <p style={{fontSize:12,fontWeight:600,color:"#16a34a",marginBottom:4}}>Chave PIX:</p>
                  <p style={{fontSize:15,fontWeight:700}}>{loja.pix}</p>
                </div>
              )}
              <p style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>⏱ Tempo estimado: 40–60 minutos</p>
              <button className="btn-p" onClick={onClose} style={{width:"100%"}}>Fechar</button>
            </div>
          ) : step === 1 ? (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700}}>Dados da entrega</h2>
                <button onClick={onClose} style={{background:"#f5f0eb",borderRadius:99,width:32,height:32,fontSize:15}}>✕</button>
              </div>
              <div style={{display:"grid",gap:10}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>NOME *</label><input className="inp" value={form.nome} onChange={e=>up("nome",e.target.value)} placeholder="Seu nome"/></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>TELEFONE *</label><input className="inp" value={form.tel} onChange={e=>up("tel",e.target.value)} placeholder="(11) 99999-9999"/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10}}>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>RUA *</label><input className="inp" value={form.rua} onChange={e=>up("rua",e.target.value)} placeholder="Rua, Av..."/></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>NUMERO *</label><input className="inp" value={form.num} onChange={e=>up("num",e.target.value)} placeholder="123"/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>BAIRRO *</label><input className="inp" value={form.bairro} onChange={e=>up("bairro",e.target.value)} placeholder="Bairro"/></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>CIDADE</label><input className="inp" value={form.cidade} onChange={e=>up("cidade",e.target.value)} placeholder="Cidade"/></div>
                </div>
                <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>COMPLEMENTO</label><input className="inp" value={form.comp} onChange={e=>up("comp",e.target.value)} placeholder="Apto, bloco..."/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:18}}>
                <button className="btn-g" onClick={onClose}>Cancelar</button>
                <button className="btn-p" onClick={()=>canNext&&setStep(2)} style={{opacity:canNext?1:.5}}>Pagamento →</button>
              </div>
            </>
          ) : (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700}}>Pagamento</h2>
                <button onClick={()=>setStep(1)} style={{background:"#f5f0eb",borderRadius:99,width:32,height:32,fontSize:15}}>←</button>
              </div>
              <div style={{display:"grid",gap:10,marginBottom:18}}>
                {[{val:"pix",label:"PIX",icon:"🟢",desc:"Pagamento instantaneo"},{val:"cartao",label:"Cartao",icon:"💳",desc:"Debito ou credito na entrega"},{val:"dinheiro",label:"Dinheiro",icon:"💵",desc:"Troco se necessario"}].map(opt => (
                  <label key={opt.val} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:12,border:"2px solid "+(form.pgto===opt.val?"var(--p)":"var(--border)"),background:form.pgto===opt.val?"color-mix(in srgb,var(--p) 5%,white)":"#fff",cursor:"pointer"}}>
                    <input type="radio" value={opt.val} checked={form.pgto===opt.val} onChange={()=>up("pgto",opt.val)} style={{display:"none"}}/>
                    <span style={{fontSize:22}}>{opt.icon}</span>
                    <div style={{flex:1}}><p style={{fontWeight:600,fontSize:14}}>{opt.label}</p><p style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{opt.desc}</p></div>
                    <div style={{width:18,height:18,borderRadius:99,border:"2px solid "+(form.pgto===opt.val?"var(--p)":"var(--border)"),background:form.pgto===opt.val?"var(--p)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {form.pgto===opt.val && <span style={{color:"#fff",fontSize:9}}>✓</span>}
                    </div>
                  </label>
                ))}
              </div>
              <div style={{background:"#f9f5f1",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                {cart.map(i => <div key={i.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"2px 0"}}><span>{i.emoji} {i.nome} x{i.qty}</span><span style={{fontWeight:600}}>{R(i.preco*i.qty)}</span></div>)}
                <div style={{borderTop:"1px solid var(--border)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:15}}><span>Total</span><span style={{color:"var(--p)"}}>{R(total)}</span></div>
              </div>
              <button className="btn-p" onClick={confirm} disabled={saving} style={{width:"100%",padding:"14px",fontSize:15}}>
                {saving ? "Salvando..." : "Confirmar pedido 🍕"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginModal({ loja, adminPass, onLogin, onClose, isMaster=false }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const login = () => {
    const u = isMaster ? MASTER_USER : "admin";
    const p = isMaster ? MASTER_PASS : (adminPass || "Pizza@Delivery2026!");
    if (user === u && pass === p) onLogin(); else setErr("Usuario ou senha incorretos");
  };
  return (
    <>
      <div className="overlay" onClick={onClose}/>
      <div className="modal-wrap">
        <div className="modal" style={{maxWidth:360}}>
          <div style={{textAlign:"center",marginBottom:22}}>
            <span style={{fontSize:36}}>{isMaster ? "🔐" : loja?.logo||"🍕"}</span>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,marginTop:8}}>{isMaster?"Painel Master":"Acesso Admin"}</h2>
            {!isMaster && <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>{loja?.nome}</p>}
          </div>
          <div style={{display:"grid",gap:10,marginBottom:14}}>
            <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>USUARIO</label><input className="inp" value={user} onChange={e=>{setUser(e.target.value);setErr("");}} placeholder={isMaster?"master":"admin"} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:4}}>SENHA</label><input className="inp" type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&login()}/></div>
          </div>
          {err && <p style={{color:"#e74c3c",fontSize:12,marginBottom:10,textAlign:"center"}}>{err}</p>}
          <button className="btn-p" onClick={login} style={{width:"100%",padding:"13px"}}>Entrar</button>
          <button className="btn-g" onClick={onClose} style={{width:"100%",marginTop:8}}>Cancelar</button>
          {isMaster && <p style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:10,opacity:.5}}>master / SaaS@Master2026!</p>}
        </div>
      </div>
    </>
  );
}

// ─── Admin Painel ─────────────────────────────────────────────────────────────
function PizzariaAdminPanel({ onClose, pedidos, onUpdateStatus, produtos, onSaveProduto, onDeleteProduto, onToggleProduto, loja, onSaveMarca }) {
  const [tab, setTab] = useState("pedidos");
  const [newProd, setNewProd] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [form, setForm] = useState({nome:"",descricao:"",preco:"",cat:"Pizzas",emoji:"🍕",badge:""});
  const [mForm, setMForm] = useState({nome:loja.nome, tagline:loja.tagline||"", pix:loja.pix||"", logo:loja.logo||"🍕", tema:loja.tema||"Brasa"});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const up = (k,v) => setForm(f => ({...f,[k]:v}));
  const upM = (k,v) => setMForm(f => ({...f,[k]:v}));

  const saveProd = async () => {
    setSaving(true);
    await onSaveProduto(form, editProd);
    setSaving(false);
    setNewProd(false); setEditProd(null);
    setForm({nome:"",descricao:"",preco:"",cat:"Pizzas",emoji:"🍕",badge:""});
  };
  const saveMarca = async () => {
    setSaving(true);
    const tema = TEMAS.find(t => t.nome === mForm.tema) || TEMAS[0];
    await onSaveMarca({...loja, ...mForm, tema});
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  return (
    <>
      <div className="overlay" onClick={onClose}/>
      <div className="drawer" style={{width:"min(560px,100vw)"}}>
        <div style={{padding:"16px 22px",background:"#1a1008",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>⚙️</span>
            <div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:"#FFF8F0"}}>Painel Admin</h2><p style={{color:"rgba(255,248,240,.45)",fontSize:11,marginTop:1}}>{loja.nome}</p></div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",borderRadius:99,width:34,height:34,fontSize:17,color:"#fff"}}>✕</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid var(--border)",background:"#fff"}}>
          {[["pedidos","📦 Pedidos",pedidos.filter(p=>p.status!=="Entregue").length],["cardapio","🍕 Cardapio",null],["marca","🎨 Marca",null]].map(([id,label,count]) => (
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"13px 6px",borderBottom:"3px solid "+(tab===id?"var(--p)":"transparent"),background:"transparent",color:tab===id?"var(--p)":"var(--muted)",fontWeight:tab===id?700:400,fontSize:12,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              {label}{count > 0 && <span style={{background:"var(--p)",color:"#fff",borderRadius:99,padding:"1px 6px",fontSize:10}}>{count}</span>}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
          {tab === "pedidos" && (
            <div style={{display:"grid",gap:12}}>
              {pedidos.length === 0 ? (
                <div style={{textAlign:"center",padding:"50px 0",color:"var(--muted)"}}><div style={{fontSize:44,marginBottom:10}}>📦</div><p>Nenhum pedido ainda</p></div>
              ) : pedidos.map(ped => {
                const sc = STATUS_COLOR[ped.status] || STATUS_COLOR["Recebido"];
                return (
                  <div key={ped.id} style={{background:"#fff",borderRadius:14,padding:"16px",border:"1px solid var(--border)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div><p style={{fontWeight:700,fontSize:15}}>{ped.numero}</p><p style={{color:"var(--muted)",fontSize:12,marginTop:1}}>{ped.horario} • {ped.nome} • {ped.tel}</p></div>
                      <span style={{background:sc.bg,color:sc.txt,padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600}}>{ped.status}</span>
                    </div>
                    <p style={{fontSize:12,color:"var(--muted)",marginBottom:10,paddingBottom:10,borderBottom:"1px solid var(--border)"}}>
                      {Array.isArray(ped.itens) ? ped.itens.map(i => i.emoji+" "+i.nome+" x"+i.qty).join(" · ") : "—"}
                    </p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"var(--p)"}}>{R(ped.total)}</span>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {STATUS_LIST.map(s => (
                          <button key={s} onClick={()=>onUpdateStatus(ped.numero,s)} style={{padding:"4px 10px",borderRadius:99,fontSize:10,fontWeight:600,background:ped.status===s?"var(--p)":"#f5f0eb",color:ped.status===s?"#fff":"var(--muted)"}}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {tab === "cardapio" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17}}>{produtos.length} produtos</h3>
                <button className="btn-p" style={{padding:"8px 16px",fontSize:13}} onClick={()=>{setEditProd(null);setNewProd(true);setForm({nome:"",descricao:"",preco:"",cat:"Pizzas",emoji:"🍕",badge:""});}}>+ Novo</button>
              </div>
              {newProd && (
                <div style={{background:"#fff",borderRadius:14,padding:"18px",border:"2px solid var(--p)",marginBottom:14}}>
                  <h4 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:15,marginBottom:12}}>{editProd?"Editar":"Novo produto"}</h4>
                  <div style={{display:"grid",gap:9}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                      <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>NOME</label><input className="inp" value={form.nome} onChange={e=>up("nome",e.target.value)}/></div>
                      <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>PRECO</label><input className="inp" type="number" value={form.preco} onChange={e=>up("preco",e.target.value)} placeholder="49.90"/></div>
                    </div>
                    <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>DESCRICAO</label><input className="inp" value={form.descricao} onChange={e=>up("descricao",e.target.value)}/></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
                      <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>CATEGORIA</label><select className="inp" value={form.cat} onChange={e=>up("cat",e.target.value)}>{CATS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}</select></div>
                      <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>EMOJI</label><input className="inp" value={form.emoji} onChange={e=>up("emoji",e.target.value)}/></div>
                      <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:3}}>BADGE</label><input className="inp" value={form.badge} onChange={e=>up("badge",e.target.value)} placeholder="Novo"/></div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button className="btn-g" style={{fontSize:13,padding:"8px 16px"}} onClick={()=>{setNewProd(false);setEditProd(null);}}>Cancelar</button>
                    <button className="btn-p" style={{fontSize:13,padding:"8px 16px"}} onClick={saveProd} disabled={saving}>{saving?"Salvando...":"Salvar"}</button>
                  </div>
                </div>
              )}
              <div style={{display:"grid",gap:8}}>
                {produtos.map(p => (
                  <div key={p.id} style={{background:"#fff",borderRadius:12,padding:"12px 14px",border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,opacity:p.ativo?1:.5}}>
                    <span style={{fontSize:24}}>{p.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><p style={{fontWeight:600,fontSize:13}}>{p.nome}</p>{p.badge && <span className="tag">{p.badge}</span>}</div>
                      <p style={{color:"var(--muted)",fontSize:11,marginTop:1}}>{p.cat} · {R(p.preco)}</p>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>{setEditProd(p);setNewProd(true);setForm({nome:p.nome,descricao:p.descricao||"",preco:String(p.preco),cat:p.cat,emoji:p.emoji,badge:p.badge||""});}} style={{background:"#f5f0eb",borderRadius:8,padding:"5px 8px",fontSize:13}}>✏️</button>
                      <button onClick={()=>onToggleProduto(p.id,p.ativo)} style={{background:p.ativo?"#fff7ed":"#f0fdf4",borderRadius:8,padding:"5px 8px",fontSize:13}}>{p.ativo?"🔴":"🟢"}</button>
                      <button onClick={()=>onDeleteProduto(p.id)} style={{background:"#fff5f5",borderRadius:8,padding:"5px 8px",fontSize:13,color:"#e74c3c"}}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "marca" && (
            <div style={{display:"grid",gap:16}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17}}>Personalizar marca</h3>
              <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:5}}>NOME</label><input className="inp" value={mForm.nome} onChange={e=>upM("nome",e.target.value)}/></div>
              <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:5}}>SLOGAN</label><input className="inp" value={mForm.tagline} onChange={e=>upM("tagline",e.target.value)}/></div>
              <div><label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:5}}>CHAVE PIX</label><input className="inp" value={mForm.pix} onChange={e=>upM("pix",e.target.value)} placeholder="email@pix.com.br"/></div>
              <div>
                <label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:8}}>LOGO</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{LOGOS.map(l=><button key={l} onClick={()=>upM("logo",l)} style={{width:40,height:40,borderRadius:10,fontSize:22,border:"2px solid "+(mForm.logo===l?"var(--p)":"var(--border)"),background:mForm.logo===l?"color-mix(in srgb,var(--p) 10%,white)":"#fff"}}>{l}</button>)}</div>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:8}}>TEMA</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                  {TEMAS.map(t=><button key={t.nome} onClick={()=>upM("tema",t.nome)} style={{padding:"9px 7px",borderRadius:10,border:"2px solid "+(mForm.tema===t.nome?"var(--p)":"var(--border)"),background:mForm.tema===t.nome?"color-mix(in srgb,var(--p) 7%,white)":"#fff",display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:18,height:18,borderRadius:99,background:t.primary,flexShrink:0}}/><span style={{fontSize:11,fontWeight:mForm.tema===t.nome?700:400}}>{t.nome}</span>
                  </button>)}
                </div>
              </div>
              <div style={{background:"linear-gradient(135deg,"+(TEMAS.find(t=>t.nome===mForm.tema)||TEMAS[0]).primary+","+(TEMAS.find(t=>t.nome===mForm.tema)||TEMAS[0]).dark+")",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:26}}>{mForm.logo}</span>
                <div><p style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17,color:"#FFF8F0"}}>{mForm.nome||"Nome"}</p><p style={{color:"rgba(255,248,240,.65)",fontSize:11,marginTop:1}}>{mForm.tagline||"Slogan"}</p></div>
              </div>
              <button className="btn-p" onClick={saveMarca} disabled={saving} style={{padding:"13px"}}>
                {saving?"Salvando...":(saved?"✓ Salvo!":"Salvar alteracoes")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// MASTER PANEL (usa UUID para lojas, loja_id para relacoes)
// ══════════════════════════════════════════════════════════
function MasterPanel() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("lojas");
  const [form, setForm] = useState({nome:"",dono:"",tel:"",email:"",pix:"",adminPass:"",tema:"Brasa",logo:"🍕",tagline:""});
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const up = (k,v) => setForm(f => ({...f,[k]:v}));
  const baseURL = window.location.origin;

  useEffect(() => { loadLojas(); }, []);

  const loadLojas = async () => {
    setLoading(true);
    const { data } = await supabase.from("lojas").select("*").order("created_at", { ascending: false });
    setLojas(data || []);
    setLoading(false);
  };

  const saveLoja = async () => {
    if (!form.nome) return;
    setSaving(true);
    const s = slugify(form.nome) || "loja-" + Date.now();
    if (editId) {
      await supabase.from("lojas").update({
        nome:form.nome, dono:form.dono, tel:form.tel, email:form.email,
        pix:form.pix, admin_pass:form.adminPass||"Pizza@Delivery2026!",
        tema:form.tema, logo:form.logo, tagline:form.tagline,
      }).eq("id", editId);
    } else {
      // Cria loja e captura o ID gerado
      const { data: nova, error } = await supabase.from("lojas").insert([{
        slug: s, nome:form.nome, dono:form.dono, tel:form.tel, email:form.email,
        pix:form.pix, admin_pass:form.adminPass||"Pizza@Delivery2026!",
        tema:form.tema, logo:form.logo, tagline:form.tagline, ativa:true, plano:"Basico",
      }]).select().single();
      // Insere produtos padrao usando o loja_id (UUID)
      if (nova && nova.id) {
        await supabase.from("produtos").insert(
          PRODUTOS_PADRAO.map(p => ({
            loja_id: nova.id,
            nome: p.nome, descricao: p.descricao, preco: p.preco,
            cat: p.cat, emoji: p.emoji, badge: p.badge||null, ativo: true,
          }))
        );
      }
    }
    await loadLojas();
    setSaving(false);
    setTab("lojas");
    setEditId(null);
    setForm({nome:"",dono:"",tel:"",email:"",pix:"",adminPass:"",tema:"Brasa",logo:"🍕",tagline:""});
    setToast("Pizzaria salva com sucesso!");
  };

  const toggleLoja = async (id, ativa) => {
    await supabase.from("lojas").update({ativa:!ativa}).eq("id", id);
    setLojas(ls => ls.map(l => l.id===id ? {...l,ativa:!l.ativa} : l));
  };
  const delLoja = async (id) => {
    if (!confirm("Excluir esta pizzaria e todos os dados?")) return;
    await supabase.from("lojas").delete().eq("id", id);
    setLojas(ls => ls.filter(l => l.id !== id));
  };
  const openEdit = (l) => {
    setEditId(l.id); setTab("add");
    setForm({nome:l.nome,dono:l.dono||"",tel:l.tel||"",email:l.email||"",pix:l.pix||"",adminPass:l.admin_pass||"",tema:l.tema||"Brasa",logo:l.logo||"🍕",tagline:l.tagline||""});
  };
  const copyLink = (s) => { navigator.clipboard?.writeText(baseURL+"/"+s); setToast("Link copiado!"); };

  const ativas = lojas.filter(l=>l.ativa).length;

  return (
    <div style={{minHeight:"100vh",background:"#0f0f1a",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0} body{background:#0f0f1a!important}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-up{animation:fadeUp .3s ease both}
        .inp-d{width:100%;border:1.5px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 13px;font-size:13px;background:rgba(255,255,255,.06);color:#fff;transition:border-color .2s;font-family:inherit}
        .inp-d:focus{border-color:#6b2fa0;outline:none} .inp-d::placeholder{color:rgba(255,255,255,.25)} .inp-d option{background:#1a1a2e;color:#fff}
      `}</style>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a0a2e,#2d1b4e)",borderBottom:"1px solid rgba(255,255,255,.08)",padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#6b2fa0,#C41E3A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🍕</div>
          <div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff"}}>PizzaSaaS</h1><p style={{color:"rgba(255,255,255,.4)",fontSize:11,marginTop:1}}>Painel Master</p></div>
        </div>
        <div style={{display:"flex",gap:20}}>
          <div style={{textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#C77DFF"}}>{lojas.length}</p><p style={{color:"rgba(255,255,255,.4)",fontSize:11}}>Total</p></div>
          <div style={{textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#7DC95E"}}>{ativas}</p><p style={{color:"rgba(255,255,255,.4)",fontSize:11}}>Ativas</p></div>
          <div style={{textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#FFD166"}}>R${ativas*97}</p><p style={{color:"rgba(255,255,255,.4)",fontSize:11}}>Receita/mes</p></div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.07)",padding:"0 28px"}}>
        {[["lojas","🍕 Pizzarias"],["add","➕ Nova pizzaria"]].map(([id,label]) => (
          <button key={id} onClick={()=>{setTab(id);if(id==="add"){setEditId(null);setForm({nome:"",dono:"",tel:"",email:"",pix:"",adminPass:"",tema:"Brasa",logo:"🍕",tagline:""});}}} style={{padding:"14px 20px",borderBottom:"2px solid "+(tab===id?"#C77DFF":"transparent"),background:"transparent",color:tab===id?"#C77DFF":"rgba(255,255,255,.4)",fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
        ))}
      </div>
      <div style={{padding:"24px 28px",maxWidth:1000,margin:"0 auto"}}>
        {tab === "lojas" && (
          <div>
            {loading ? (
              <div style={{textAlign:"center",padding:"80px 0"}}><div style={{width:36,height:36,border:"3px solid rgba(199,125,255,.2)",borderTop:"3px solid #C77DFF",borderRadius:"50%",animation:"spin .9s linear infinite",margin:"0 auto"}}/></div>
            ) : lojas.length === 0 ? (
              <div style={{textAlign:"center",padding:"80px 0",color:"rgba(255,255,255,.3)"}}>
                <div style={{fontSize:56,marginBottom:14}}>🍕</div>
                <p style={{fontSize:16,fontWeight:600,color:"rgba(255,255,255,.5)"}}>Nenhuma pizzaria cadastrada</p>
                <button onClick={()=>setTab("add")} style={{marginTop:20,background:"#6b2fa0",color:"#fff",borderRadius:99,padding:"11px 24px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cadastrar primeira pizzaria</button>
              </div>
            ) : (
              <div style={{display:"grid",gap:14}}>
                {lojas.map((l,i) => {
                  const tema = TEMAS.find(t => t.nome === l.tema) || TEMAS[0];
                  return (
                    <div key={l.id} className="fade-up" style={{animationDelay:i*40+"ms",background:"rgba(255,255,255,.04)",border:"1px solid "+(l.ativa?"rgba(255,255,255,.1)":"rgba(255,0,0,.15)"),borderRadius:16,padding:"18px 22px",display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,"+tema.primary+","+tema.dark+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{l.logo||"🍕"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                          <p style={{fontWeight:700,fontSize:15,color:"#fff"}}>{l.nome}</p>
                          <span style={{background:l.ativa?"rgba(125,201,94,.15)":"rgba(255,80,80,.15)",color:l.ativa?"#7DC95E":"#ff6060",padding:"2px 9px",borderRadius:99,fontSize:10,fontWeight:700}}>{l.ativa?"ATIVA":"PAUSADA"}</span>
                          <span style={{background:"rgba(199,125,255,.15)",color:"#C77DFF",padding:"2px 9px",borderRadius:99,fontSize:10,fontWeight:700}}>{l.plano||"Basico"}</span>
                        </div>
                        <p style={{color:"rgba(255,255,255,.4)",fontSize:12}}>{l.dono&&l.dono+" · "}{l.tel&&l.tel+" · "}Desde {new Date(l.created_at).toLocaleDateString("pt-BR")}</p>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                          <code style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.6)",padding:"3px 10px",borderRadius:8,fontSize:11,fontFamily:"monospace"}}>{baseURL}/{l.slug}</code>
                          <button onClick={()=>copyLink(l.slug)} style={{background:"rgba(255,255,255,.08)",borderRadius:8,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"inherit"}}>Copiar</button>
                          <a href={"/"+l.slug} target="_blank" style={{background:"rgba(107,47,160,.3)",borderRadius:8,padding:"3px 10px",fontSize:11,color:"#C77DFF",textDecoration:"none"}}>Abrir →</a>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button onClick={()=>openEdit(l)} style={{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"8px 12px",fontSize:14}}>✏️</button>
                        <button onClick={()=>toggleLoja(l.id,l.ativa)} style={{background:l.ativa?"rgba(255,100,100,.15)":"rgba(125,201,94,.15)",borderRadius:10,padding:"8px 12px",fontSize:14}}>{l.ativa?"⏸":"▶️"}</button>
                        <button onClick={()=>delLoja(l.id)} style={{background:"rgba(255,80,80,.1)",borderRadius:10,padding:"8px 12px",fontSize:14,color:"#ff6060"}}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === "add" && (
          <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"28px"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",marginBottom:22}}>{editId?"Editar pizzaria":"Cadastrar nova pizzaria"}</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"1/-1"}}><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>NOME DA PIZZARIA *</label><input className="inp-d" value={form.nome} onChange={e=>up("nome",e.target.value)} placeholder="Pizzaria do Joao"/></div>
              <div><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>NOME DO DONO</label><input className="inp-d" value={form.dono} onChange={e=>up("dono",e.target.value)} placeholder="Joao Silva"/></div>
              <div><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>TELEFONE</label><input className="inp-d" value={form.tel} onChange={e=>up("tel",e.target.value)} placeholder="(11) 99999-9999"/></div>
              <div><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>EMAIL</label><input className="inp-d" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="joao@email.com"/></div>
              <div><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>CHAVE PIX</label><input className="inp-d" value={form.pix} onChange={e=>up("pix",e.target.value)} placeholder="pix@pizzaria.com"/></div>
              <div style={{gridColumn:"1/-1"}}><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>SLOGAN</label><input className="inp-d" value={form.tagline} onChange={e=>up("tagline",e.target.value)} placeholder="A melhor pizza da cidade!"/></div>
              <div><label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>SENHA ADMIN DA PIZZARIA</label><input className="inp-d" value={form.adminPass} onChange={e=>up("adminPass",e.target.value)} placeholder="Senha segura"/></div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>COR DO TEMA</label>
                <select className="inp-d" value={form.tema} onChange={e=>up("tema",e.target.value)}>{TEMAS.map(t=><option key={t.nome} value={t.nome}>{t.nome}</option>)}</select>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:8}}>LOGO</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{LOGOS.slice(0,8).map(l=><button key={l} onClick={()=>up("logo",l)} style={{width:36,height:36,borderRadius:8,fontSize:20,border:"2px solid "+(form.logo===l?"#6b2fa0":"rgba(255,255,255,.15)"),background:form.logo===l?"rgba(107,47,160,.3)":"rgba(255,255,255,.06)"}}>{l}</button>)}</div>
              </div>
            </div>
            {form.nome && (
              <div style={{marginTop:18,background:"rgba(255,255,255,.04)",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,color:"rgba(255,255,255,.4)"}}>Link:</span>
                <code style={{color:"#C77DFF",fontSize:13,fontFamily:"monospace"}}>{baseURL}/{slugify(form.nome)||"nome-da-pizzaria"}</code>
              </div>
            )}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={()=>{setTab("lojas");setEditId(null);}} style={{background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.6)",borderRadius:99,padding:"11px 22px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
              <button onClick={saveLoja} disabled={!form.nome||saving} style={{background:form.nome?"linear-gradient(135deg,#6b2fa0,#C41E3A)":"rgba(255,255,255,.1)",color:form.nome?"#fff":"rgba(255,255,255,.3)",borderRadius:99,padding:"11px 28px",fontSize:14,fontWeight:600,cursor:form.nome?"pointer":"not-allowed",fontFamily:"inherit",opacity:saving?.7:1}}>
                {saving?"Salvando...":(editId?"Salvar alteracoes":"Cadastrar pizzaria →")}
              </button>
            </div>
          </div>
        )}
      </div>
      {toast && <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#7DC95E",color:"#0f1a0a",padding:"10px 22px",borderRadius:99,fontSize:13,fontWeight:700,zIndex:9999,animation:"toastIn .3s ease both",whiteSpace:"nowrap"}} onClick={()=>setToast(null)}>✓ {toast}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ROUTER PRINCIPAL
// ══════════════════════════════════════════════════════════
export default function App() {
  const slugAtual = getSlugFromURL();
  const [loja, setLoja] = useState(null);
  const [loadingLoja, setLoadingLoja] = useState(true);
  const [masterLogado, setMasterLogado] = useState(false);

  useEffect(() => {
    if (!slugAtual || slugAtual === "master") { setLoadingLoja(false); return; }
    // Busca loja pelo slug
    supabase.from("lojas").select("*").eq("slug", slugAtual).eq("ativa", true).single()
      .then(({ data }) => { setLoja(data || null); setLoadingLoja(false); });
  }, [slugAtual]);

  if (slugAtual === "master") {
    if (!masterLogado) return (
      <>
        <GlobalCSS/>
        <div style={{minHeight:"100vh",background:"#0f0f1a",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <LoginModal isMaster loja={null} onLogin={()=>setMasterLogado(true)} onClose={()=>window.history.back()}/>
        </div>
      </>
    );
    return <MasterPanel/>;
  }

  if (slugAtual) {
    if (loadingLoja) return <LoadingScreen/>;
    if (!loja) return (
      <>
        <GlobalCSS/>
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:"#FFF8F0"}}>
          <span style={{fontSize:64}}>🍕</span>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#1a1008"}}>Pizzaria nao encontrada</h1>
          <p style={{color:"#8a7060",fontSize:14}}>Este link nao existe ou esta temporariamente indisponivel.</p>
        </div>
      </>
    );
    return <PizzariaApp loja={loja}/>;
  }

  return (
    <>
      <GlobalCSS/>
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0f1a 0%,#1a0a2e 50%,#0f1a0a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",fontFamily:"'DM Sans',sans-serif"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600&display=swap')`}</style>
        <div style={{textAlign:"center",maxWidth:560}}>
          <div style={{fontSize:72,marginBottom:20}}>🍕</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,8vw,64px)",fontWeight:700,color:"#fff",lineHeight:1.1,marginBottom:16}}>
            Delivery digital<br/><span style={{background:"linear-gradient(90deg,#C41E3A,#C77DFF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>para pizzarias</span>
          </h1>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:17,lineHeight:1.7,marginBottom:36}}>Cada pizzaria tem seu site proprio, cardapio, pedidos salvos online. Sem comissao por pedido.</p>
          <a href="/master" style={{background:"linear-gradient(135deg,#6b2fa0,#C41E3A)",color:"#fff",borderRadius:99,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",boxShadow:"0 4px 24px rgba(107,47,160,.5)",display:"inline-block"}}>⚙️ Painel Master</a>
          <div style={{display:"flex",gap:24,justifyContent:"center",marginTop:40,flexWrap:"wrap"}}>
            {[["🚀","Deploy gratuito","Vercel gratis"],["💳","R$97/mes","por pizzaria"],["🔥","Sem comissao","por pedido"]].map(([icon,title,sub]) => (
              <div key={title} style={{textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{icon}</div><p style={{color:"#fff",fontWeight:700,fontSize:14}}>{title}</p><p style={{color:"rgba(255,255,255,.35)",fontSize:12}}>{sub}</p></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
