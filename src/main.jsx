import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search,
  ShoppingBag, Sparkles, Star, Trash2, X, MapPin, CreditCard, Smartphone,
  Truck, Gift, Leaf, Instagram
} from "lucide-react";
import "./styles.css";

const products = [
  {id:1,name:"Pink Pipe-Cleaner Rose",category:"Roses",color:"Pink",price:149,rating:4.9,emoji:"🌹",image:"/images/pink-rose.jpg",desc:"A delicate forever rose, hand-shaped petal by petal."},
  {id:2,name:"Forever Sunflower",category:"Sunflowers",color:"Yellow",price:199,rating:4.8,emoji:"🌻",image:"/images/sunflower-single.jpg",desc:"A cheerful sunflower made to brighten desks and days."},
  {id:3,name:"Mini Pink Bouquet",category:"Bouquets",color:"Pink",price:399,rating:4.9,emoji:"💐",image:"/images/mini-bouquet.jpg",desc:"A tiny bouquet packed with big happy energy."},
  {id:4,name:"Rainbow Bloom Bundle",category:"Gift Sets",color:"Multi",price:499,rating:4.8,emoji:"🌈",image:"/images/mixed-single-wraps.png",desc:"A colorful mix for birthdays, surprises and celebrations."},
  {id:5,name:"White Daisy",category:"Single Flowers",color:"White",price:129,rating:4.7,emoji:"🌼",image:"/images/mixed-single-wraps.png",desc:"Simple, soft and effortlessly charming."},
  {id:6,name:"Love You Bouquet",category:"Bouquets",color:"Pink",price:599,rating:5.0,emoji:"💗",image:"/images/love-bouquet.png",desc:"A romantic arrangement for your favorite person."},
  {id:7,name:"Green Leaf Rose",category:"Roses",color:"Green",price:179,rating:4.7,emoji:"🌿",image:"/images/pink-rose.jpg",desc:"A fresh green-and-pink statement flower."},
  {id:8,name:"Pretty Pink Tulip",category:"Tulips",color:"Pink",price:159,rating:4.8,emoji:"🌷",image:"/images/pink-tulip.jpg",desc:"A playful tulip that stays fresh forever."},
  {id:9,name:"Sunshine Bouquet",category:"Bouquets",color:"Yellow",price:549,rating:4.9,emoji:"💛",image:"/images/sunflower-bouquet-new.png",desc:"Golden blooms designed for joyful gifting."},
  {id:10,name:"Pastel Flower Set",category:"Gift Sets",color:"Multi",price:699,rating:4.9,emoji:"🌸",image:"/images/pastel-set.png",desc:"A soft pastel collection for a dreamy corner."},
  {id:11,name:"Custom Birthday Bloom",category:"Custom Flowers",color:"Multi",price:799,rating:5.0,emoji:"🎀",image:"/images/colorful-bouquet.png",desc:"A personalized forever flower set for their big day."},
  {id:12,name:"Flower Keychain",category:"Keychains",color:"Multi",price:149,rating:4.9,emoji:"🌸",image:"/images/flower-keychain.jpg",desc:"A tiny handmade flower charm to carry a little joy everywhere."},
  {id:13,name:"Ruby Red Tulip",category:"Tulips",color:"Red",price:199,rating:4.9,emoji:"🌷",image:"/images/red-tulip.jpg",desc:"A rich red chenille tulip with a soft handmade finish."},
  {id:14,name:"Blush Pink Tulip",category:"Tulips",color:"Pink",price:199,rating:4.9,emoji:"🌷",image:"/images/pink-tulip.jpg",desc:"A soft pink forever tulip, made for sweet little surprises."},
  {id:15,name:"Custom Tulip Bouquet",category:"Custom Flowers",color:"Custom",price:699,rating:5.0,emoji:"💐",image:"/images/pink-tulip-bouquet.png",desc:"A made-to-order bouquet in your colors, mood and message."}
];

const categories = [
  ["Roses","🌹"],["Sunflowers","🌻"],["Tulips","🌷"],["Bouquets","💐"],
  ["Gift Sets","🎁"],["Custom Flowers","✨"],["Keychains","🌸"]
];

const CartContext = createContext(null);
function CartProvider({children}) {
  const [cart,setCart] = useState(() => JSON.parse(localStorage.getItem("euphoria-cart") || "[]"));
  useEffect(()=>localStorage.setItem("euphoria-cart", JSON.stringify(cart)),[cart]);
  const add = (product) => setCart(c => {
    const found = c.find(x=>x.id===product.id);
    return found ? c.map(x=>x.id===product.id ? {...x,qty:x.qty+1}:x) : [...c,{...product,qty:1}];
  });
  const change = (id,delta) => setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x));
  const remove = id => setCart(c=>c.filter(x=>x.id!==id));
  const clear = () => setCart([]);
  const count = cart.reduce((s,x)=>s+x.qty,0);
  const subtotal = cart.reduce((s,x)=>s+x.price*x.qty,0);
  return <CartContext.Provider value={{cart,add,change,remove,clear,count,subtotal}}>{children}</CartContext.Provider>
}
const useCart=()=>useContext(CartContext);

function FlowerArt({emoji,small=false}) {
  return <div className={"flower-art "+(small?"small":"")}><span>{emoji}</span><i></i><b></b></div>
}

function Header({page,setPage}) {
  const {count}=useCart(); const [open,setOpen]=useState(false);
  const go=p=>{setPage(p);setOpen(false);window.scrollTo({top:0,behavior:"smooth"})};
  return <header className="header">
    <div className="nav wrap">
      <button className="brand" onClick={()=>go("home")}><img src="/logo.png" alt="Handmade flowers logo"/></button>
      <nav className={open?"nav-links open":"nav-links"}>
        <button className={page==="home"?"active":""} onClick={()=>go("home")}>Home</button>
        <button className={page==="shop"?"active":""} onClick={()=>go("shop")}>Shop</button>
        <button onClick={()=>go("shop")}>Categories</button>
        <button className={page==="story"?"active":""} onClick={()=>go("story")}>Our Story</button>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" aria-label="Search" onClick={()=>go("shop")}><Search size={19}/></button>
        <button className="cart-btn" onClick={()=>go("cart")}><ShoppingBag size={19}/><span>{count}</span></button>
        <button className="menu-btn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
    </div>
  </header>
}

function ProductCard({p,onOpen}) {
  const {add}=useCart();
  return <article className="product-card">
    <button className="product-visual" onClick={()=>onOpen(p)}>
      <span className="badge">Handmade</span><Heart className="heart" size={18}/>{p.image?<img className="product-image" src={p.image} alt={p.name} loading="lazy"/>:<FlowerArt emoji={p.emoji}/>}<div className="swatch">{p.color}</div>
    </button>
    <div className="product-info">
      <div className="rating"><Star size={14} fill="currentColor"/>{p.rating}</div>
      <h3>{p.name}</h3><p>{p.desc}</p>
      <div className="product-bottom"><strong>₹{p.price}</strong><button onClick={()=>add(p)}>Add to cart</button></div>
    </div>
  </article>
}

function Home({setPage,setSelected}) {
  const {add}=useCart();
  return <main>
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15}/> Handmade • Happy • Forever</span>
          <h1>Flowers that <em>light up</em> moments.</h1>
          <p>Handcrafted pipe-cleaner blooms made to make birthdays, surprises, corners and everyday little moments feel extraordinary.</p>
          <div className="hero-actions"><button className="primary" onClick={()=>setPage("shop")}>Shop flowers <ArrowRight size={18}/></button><button className="text-btn" onClick={()=>setPage("shop")}>Explore bouquets</button></div>
          <div className="mini-proof"><div className="avatars">🌸 🌷 🌻</div><span><b>Loved by flower people</b><br/>4.9/5 from happy customers</span></div>
        </div>
        <div className="hero-art">
          <div className="sun"></div><div className="spark s1">✦</div><div className="spark s2">✦</div>
          <div className="bouquet-card"><span className="tape">HANDMADE</span><img src="/images/sunflower-bouquet-new.png" alt="Handmade pipe cleaner sunflower bouquet"/><div className="stem"></div></div>
          <div className="floating-note"><Gift size={17}/><span>Gift-ready<br/><b>always</b></span></div>
        </div>
      </div>
    </section>

    <section className="section wrap">
      <div className="section-head"><div><span className="eyebrow">Shop by feeling</span><h2>Find your perfect bloom.</h2></div><button className="text-btn" onClick={()=>setPage("shop")}>View all <ArrowRight size={16}/></button></div>
      <div className="categories">{categories.map(([name,emoji],i)=><button key={name} className={"category c"+i} onClick={()=>setPage("shop")}><span>{emoji}</span><b>{name}</b><small>Explore →</small></button>)}</div>
    </section>

    <section className="section featured"><div className="wrap">
      <div className="section-head"><div><span className="eyebrow">Made for moments</span><h2>Little blooms, big feelings.</h2></div><button className="text-btn" onClick={()=>setPage("shop")}>Shop everything <ArrowRight size={16}/></button></div>
      <div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p} onOpen={setSelected}/>)}</div>
    </div></section>

    <section className="story wrap">
      <div className="story-art"><div>🌷</div><div>🌹</div><div>🌻</div></div>
      <div><span className="eyebrow">Why handmade flowers?</span><h2>We make flowers for the moments you want to keep.</h2><p>Every bloom is shaped by hand from soft pipe cleaners, giving you a flower that feels playful today and stays bright tomorrow.</p><div className="perks"><span><Leaf/> Forever fresh</span><span><Heart/> Made with love</span><span><Gift/> Gift-ready</span></div></div>
    </section>

    <section className="cta"><div><Sparkles/><h2>Ready to light up someone's day?</h2><p>Pick a bloom. Add a little joy. Make the moment unforgettable.</p><button className="primary dark" onClick={()=>setPage("shop")}>Start shopping <ArrowRight size={18}/></button></div></section>
  </main>
}

function Shop({setSelected}) {
  const [query,setQuery]=useState(""); const [cat,setCat]=useState("All"); const [sort,setSort]=useState("Featured");
  const filtered=useMemo(()=>{
    let a=products.filter(p=>(cat==="All"||p.category===cat) && (p.name+p.desc+p.color).toLowerCase().includes(query.toLowerCase()));
    if(sort==="Price: Low to High")a.sort((x,y)=>x.price-y.price);
    if(sort==="Price: High to Low")a.sort((x,y)=>y.price-x.price);
    if(sort==="Top Rated")a.sort((x,y)=>y.rating-x.rating);
    return a;
  },[query,cat,sort]);
  return <main className="shop-page wrap">
    <div className="shop-hero"><span className="eyebrow">The handmade collection</span><h1>Choose your forever flower.</h1><p>Mix, match and find a little bloom that feels like you.</p></div>
    <div className="shop-tools">
      <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search flowers, bouquets..."/></div>
      <div className="select"><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Featured</option><option>Top Rated</option><option>Price: Low to High</option><option>Price: High to Low</option></select><ChevronDown size={16}/></div>
    </div>
    <div className="chips"><button className={cat==="All"?"selected":""} onClick={()=>setCat("All")}>All flowers</button>{categories.map(([x])=><button className={cat===x?"selected":""} onClick={()=>setCat(x)} key={x}>{x}</button>)}</div>
    <div className="product-grid shop-grid">{filtered.map(p=><ProductCard key={p.id} p={p} onOpen={setSelected}/>)}</div>
    {!filtered.length&&<div className="empty"><span>🌱</span><h2>No blooms found</h2><p>Try another search or category.</p></div>}
  </main>
}

function CartPage({setPage}) {
  const {cart,change,remove,subtotal}=useCart(); const [form,setForm]=useState(()=>JSON.parse(localStorage.getItem("euphoria-details")||"{}")); const [coupon,setCoupon]=useState(""); const [discount,setDiscount]=useState(0);
  const delivery=subtotal>999||subtotal===0?0:49, total=subtotal+delivery-discount;
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=e=>{e.preventDefault(); if(!cart.length)return; localStorage.setItem("euphoria-details",JSON.stringify(form)); localStorage.setItem("euphoria-checkout",JSON.stringify({subtotal,delivery,discount,total})); setPage("payment")};
  if(!cart.length)return <main className="empty-cart wrap"><div>🪻</div><h1>Your bouquet is waiting.</h1><p>Your cart is empty. Let's add a little color.</p><button className="primary" onClick={()=>setPage("shop")}>Shop flowers <ArrowRight size={18}/></button></main>;
  return <main className="checkout wrap">
    <div className="steps"><span className="current"><b>1</b> Cart</span><i></i><span><b>2</b> Details</span><i></i><span><b>3</b> Payment</span><i></i><span><b>4</b> Complete</span></div>
    <div className="checkout-grid">
      <section><div className="page-title"><span className="eyebrow">Your picks</span><h1>Your bouquet basket.</h1></div>
        <div className="cart-list">{cart.map(x=><div className="cart-item" key={x.id}><div className="cart-img">{x.image?<img src={x.image} alt={x.name}/>:<FlowerArt emoji={x.emoji} small/>}</div><div className="cart-main"><h3>{x.name}</h3><span>{x.category}</span><strong>₹{x.price}</strong></div><div className="qty"><button onClick={()=>change(x.id,-1)}><Minus size={14}/></button><b>{x.qty}</b><button onClick={()=>change(x.id,1)}><Plus size={14}/></button></div><button className="delete" onClick={()=>remove(x.id)}><Trash2 size={17}/></button></div>)}</div>
        <form className="details" onSubmit={submit}><div className="page-title"><span className="eyebrow">Delivery details</span><h2>Where should we send the joy?</h2></div>
          <div className="form-grid">{["name","phone","email","address","area","city","state","pin"].map((k,i)=><label className={k==="address"?"full":""} key={k}>{k==="name"?"Full name":k==="phone"?"Mobile number":k==="email"?"Email":k==="address"?"Address":k==="area"?"Area / Building":k==="city"?"City":k==="state"?"State":"PIN code"}<input required value={form[k]||""} onChange={e=>update(k,e.target.value)} placeholder={k==="phone"?"10-digit mobile":k==="pin"?"6-digit PIN":""} type={k==="email"?"email":"text"}/></label>)}</div>
          <label>Delivery instructions <textarea value={form.instructions||""} onChange={e=>update("instructions",e.target.value)} placeholder="Any special instructions?"/></label>
          <button className="primary full-btn" type="submit">Continue to payment <ArrowRight size={18}/></button>
        </form>
      </section>
      <aside className="summary"><h3>Order summary</h3><div className="sum-row"><span>Subtotal</span><b>₹{subtotal}</b></div><div className="sum-row"><span>Delivery</span><b>{delivery?"₹"+delivery:"FREE"}</b></div><div className="coupon"><input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code"/><button onClick={()=>setDiscount(coupon==="EUPHORIA10"?Math.round(subtotal*.1):0)}>Apply</button></div>{discount>0&&<div className="discount"><Check size={14}/> EUPHORIA10 applied</div>}<div className="total"><span>Total</span><strong>₹{total}</strong></div><p className="secure"><Check size={14}/> Secure checkout · Handmade with care</p></aside>
    </div>
  </main>
}

function Payment({setPage}) {
  const {clear}=useCart(); const data=JSON.parse(localStorage.getItem("euphoria-checkout")||"{}"); const details=JSON.parse(localStorage.getItem("euphoria-details")||"{}");
  const [method,setMethod]=useState("UPI"); const [loading,setLoading]=useState(false);
  const pay=()=>{setLoading(true);setTimeout(()=>{const order="EPH-"+new Date().getFullYear()+"-"+Math.floor(1000+Math.random()*9000);localStorage.setItem("euphoria-order",JSON.stringify({order,...data,details,method}));clear();setPage("thanks")},1200)};
  return <main className="payment wrap"><div className="steps"><span className="done"><b>✓</b> Cart</span><i></i><span className="done"><b>✓</b> Details</span><i></i><span className="current"><b>3</b> Payment</span><i></i><span><b>4</b> Complete</span></div>
    <div className="payment-grid"><section><span className="eyebrow">Almost there</span><h1>Complete your purchase.</h1><p className="muted">One last little step before your blooms begin their journey.</p>
      <div className="methods">{[["UPI",Smartphone,"Pay instantly with UPI"],["Card",CreditCard,"Credit or debit card"],["COD",Truck,"Pay when your flowers arrive"]].map(([name,Icon,desc])=><button className={method===name?"method selected":"method"} onClick={()=>setMethod(name)} key={name}><Icon/><span><b>{name==="COD"?"Cash on Delivery":name}</b><small>{desc}</small></span>{method===name&&<Check className="method-check"/>}</button>)}</div>
      {method==="UPI"&&<label className="pay-input">UPI ID<input placeholder="yourname@upi"/></label>}
      {method==="Card"&&<div className="card-fields"><label>Card number<input placeholder="1234 5678 9012 3456"/></label><label>Name on card<input placeholder="Your name"/></label><label>Expiry<input placeholder="MM/YY"/></label><label>CVV<input placeholder="123"/></label></div>}
      {method==="COD"&&<div className="cod-note"><Truck/><span><b>Cash on delivery selected.</b><br/>Please keep the order amount ready at delivery.</span></div>}
      <button className="primary pay-btn" onClick={pay} disabled={loading}>{loading?"Preparing your blooms...":<>Pay ₹{data.total||0} <ArrowRight size={18}/></>}</button>
    </section><aside className="summary payment-summary"><h3>Order total</h3><div className="sum-row"><span>Subtotal</span><b>₹{data.subtotal||0}</b></div><div className="sum-row"><span>Delivery</span><b>{data.delivery?"₹"+data.delivery:"FREE"}</b></div><div className="sum-row"><span>Discount</span><b className="green">-₹{data.discount||0}</b></div><div className="total"><span>You'll pay</span><strong>₹{data.total||0}</strong></div><div className="address-mini"><MapPin size={16}/><span><b>Deliver to</b><br/>{details.name}<br/>{details.address}, {details.city}</span></div></aside></div>
  </main>
}

function Thanks({setPage}) {
  const o=JSON.parse(localStorage.getItem("euphoria-order")||"{}");
  return <main className="thanks wrap"><div className="confetti">✦　🌸　✦　🌷　✦</div><div className="check-circle"><Check size={42}/></div><span className="eyebrow">Order confirmed</span><h1>Your bloom is on its way! 🌸</h1><p>Thank you for choosing handmade flowers. We can't wait for your blooms to light up the moment.</p><div className="order-card"><div><small>ORDER NUMBER</small><b>{o.order||"EPH-2026-0000"}</b></div><div><small>ESTIMATED DELIVERY</small><b>3–5 business days</b></div><div><small>PAYMENT</small><b>{o.method==="COD"?"Cash on Delivery":o.method||"UPI"}</b></div><div><small>TOTAL</small><b>₹{o.total||0}</b></div></div><div className="thanks-actions"><button className="primary" onClick={()=>setPage("shop")}>Continue shopping <ArrowRight size={18}/></button><button className="outline" onClick={()=>setPage("home")}>Back to home</button></div></main>
}

function OurStory({setPage}){return <main className="story-page wrap">
  <section className="story-hero"><div><span className="eyebrow"><Sparkles size={15}/> Our story</span><h1>Handmade flowers.<br/><em>Made for memories.</em></h1><p>It began with a simple idea: what if a flower could hold a feeling for longer? We turn soft pipe cleaners into bright, playful blooms that are shaped by hand and made to stay.</p><button className="primary" onClick={()=>setPage("shop")}>Shop our blooms <ArrowRight size={18}/></button></div><div className="story-logo"><img src="/logo.png" alt="Handmade flowers logo"/></div></section>
  <section className="story-values"><div className="story-photo"><img src="/images/pink-tulip-bouquet.png" alt="Handmade pipe cleaner tulip flowers"/></div><div><span className="eyebrow">Our craft</span><h2>Every petal is a tiny piece of joy.</h2><p>From twisting the first chenille stem to wrapping the final ribbon, every flower is assembled with patience and personality. No two handmade blooms are exactly alike — and that's the charm.</p><div className="story-points"><div><b>01</b><span><strong>Shape</strong>Soft pipe cleaners are carefully formed into petals and leaves.</span></div><div><b>02</b><span><strong>Style</strong>Colors and bouquets are arranged around the feeling you want to share.</span></div><div><b>03</b><span><strong>Send joy</strong>Every bloom is packed ready for gifting, celebrating or keeping.</span></div></div></div></section>
  <section className="story-social"><span className="eyebrow">Follow our craft journey</span><h2>See the craft behind the scenes.</h2><p>New flowers, custom orders, wrapping ideas and tiny moments of making.</p><a className="instagram" href="https://www.instagram.com/euphoria._.fowers/" target="_blank" rel="noreferrer"><Instagram size={20}/> @euphoria._.fowers <ArrowRight size={16}/></a></section>
</main>}

function Footer(){return <footer><div className="wrap footer-grid"><div><div className="footer-brand"><img src="/logo.png" alt="Handmade flowers logo"/></div><p>Flowers that light up moments.<br/>Handmade forever blooms.</p></div><div><b>Shop</b><a>Roses</a><a>Bouquets</a><a>Gift Sets</a></div><div><b>Help</b><a>Shipping</a><a>Contact</a><a href="#" onClick={(e)=>e.preventDefault()}>Our story</a></div><div><b>Follow the joy</b><a className="social" href="https://www.instagram.com/euphoria._.fowers/" target="_blank" rel="noreferrer"><Instagram size={18}/><span>@euphoria._.fowers</span></a></div></div><div className="wrap copyright">© 2026 Handmade Flowers. Made with flowers & feelings.</div></footer>}

function App(){
  const [page,setPage]=useState("home"); const [selected,setSelected]=useState(null); const {add}=useCart(); 
  const open=p=>setSelected(p);
  return <><Header page={page} setPage={setPage}/>{page==="home"&&<Home setPage={setPage} setSelected={open}/>} {page==="shop"&&<Shop setSelected={open}/>} {page==="story"&&<OurStory setPage={setPage}/>} {page==="cart"&&<CartPage setPage={setPage}/>} {page==="payment"&&<Payment setPage={setPage}/>} {page==="thanks"&&<Thanks setPage={setPage}/>}<Footer/>
  {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}><X/></button><div className="modal-visual">{selected.image?<img src={selected.image} alt={selected.name}/>:<FlowerArt emoji={selected.emoji}/>}</div><div className="modal-copy"><span className="eyebrow">{selected.category}</span><h2>{selected.name}</h2><div className="modal-rating"><Star size={15} fill="currentColor"/> {selected.rating} · Handmade</div><p>{selected.desc}</p><strong>₹{selected.price}</strong><button className="primary full-btn" onClick={()=>{add(selected);setSelected(null)}}>Add to cart <ShoppingBag size={18}/></button></div></div></div>}
  <div className="cart-float" onClick={()=>setPage("cart")}><ShoppingBag size={20}/><span>{useCart().count}</span></div>
  </>;
}

createRoot(document.getElementById("root")).render(<CartProvider><App/></CartProvider>);