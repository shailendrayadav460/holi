import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://backend-holi-images-1.onrender.com/api/holi";

const FAMILY_ROLES = [
  { label: "Dadi / Nani",      emoji: "👵", grad: "#f87171,#ec4899" },
  { label: "Dada / Nana",      emoji: "👴", grad: "#fb923c,#f97316" },
  { label: "Papa / Kaka",      emoji: "👨", grad: "#60a5fa,#818cf8" },
  { label: "Maa / Mami",       emoji: "👩", grad: "#f472b6,#fb7185" },
  { label: "Bhaiya / Bhai",    emoji: "🧑", grad: "#2dd4bf,#22d3ee" },
  { label: "Didi / Behen",     emoji: "👧", grad: "#c084fc,#a855f7" },
  { label: "Chote / Bachche",  emoji: "🧒", grad: "#fbbf24,#f59e0b" },
  { label: "Mausa / Mausi",    emoji: "🧑‍🤝‍🧑", grad: "#34d399,#10b981" },
  { label: "Fufa / Bua",       emoji: "👫", grad: "#e879f9,#ec4899" },
  { label: "Other",            emoji: "🙏", grad: "#fb923c,#ef4444" },
];

const FILTERS = ["All", "Dadi / Nani", "Dada / Nana", "Papa / Kaka", "Maa / Mami", "Bhaiya / Bhai", "Didi / Behen", "Chote / Bachche"];

const roleGrad = (label) => {
  const r = FAMILY_ROLES.find(x => x.label === label);
  return r ? r.grad : "#fb923c,#ec4899";
};
const roleEmoji = (label) => FAMILY_ROLES.find(x => x.label === label)?.emoji || "🙏";

/* ─── Floating Petals ─── */
function Petals() {
  const list = ["🌸","🌺","🏵️","🌷","🪷","✨","🌼","🎨"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({length:14}).map((_,i)=>(
        <span key={i} className="absolute opacity-50" style={{
          left:`${(i*7.3)%100}%`,
          fontSize:`${0.9+(i%3)*0.35}rem`,
          animation:`petalFall ${9+(i%5)*2}s linear ${i*0.8}s infinite`
        }}>{list[i%list.length]}</span>
      ))}
    </div>
  );
}

/* ─── Custom Role Dropdown ─── */
function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return ()=>document.removeEventListener("mousedown", h);
  },[]);

  const sel = FAMILY_ROLES.find(r=>r.label===value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button type="button" onClick={()=>setOpen(o=>!o)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/80 border-2 border-orange-200 hover:border-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm">
        <span className="flex items-center gap-2">
          {sel ? (
            <>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{background:`linear-gradient(135deg,${sel.grad})`,boxShadow:`0 2px 8px rgba(0,0,0,0.12)`}}>
                {sel.emoji}
              </span>
              <span className="font-semibold text-gray-700 text-sm">{sel.label}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm font-medium">Select Family Role</span>
          )}
        </span>
        <span className={`text-orange-400 transition-transform duration-300 text-sm ${open?"rotate-180":""}`}>▾</span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 w-full mt-1.5 rounded-2xl bg-white shadow-2xl border border-orange-100 overflow-hidden"
          style={{animation:"dropIn .2s cubic-bezier(.175,.885,.32,1.275)"}}>
          <div className="p-1.5 max-h-60 overflow-y-auto grid grid-cols-1 gap-0.5">
            {FAMILY_ROLES.map(role=>(
              <button key={role.label} type="button"
                onClick={()=>{onChange(role.label);setOpen(false);}}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left hover:bg-orange-50"
                style={value===role.label?{
                  background:`linear-gradient(135deg,${role.grad})`,
                  boxShadow:"0 2px 10px rgba(0,0,0,0.12)"
                }:{}}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{background: value===role.label?"rgba(255,255,255,0.25)":`linear-gradient(135deg,${role.grad})`,
                    opacity: value===role.label?1:0.85}}>
                  {role.emoji}
                </span>
                <span className={`font-semibold text-sm ${value===role.label?"text-white":"text-gray-700"}`}>
                  {role.label}
                </span>
                {value===role.label && <span className="ml-auto text-white font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({toast}) {
  if(!toast) return null;
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-full shadow-xl font-semibold text-sm text-white whitespace-nowrap`}
      style={{
        background: toast.type==="error"
          ? "linear-gradient(135deg,#ef4444,#dc2626)"
          : "linear-gradient(135deg,#fb923c,#ec4899)",
        animation:"slideUp .3s ease",
        boxShadow:"0 8px 25px rgba(251,146,60,0.4)"
      }}>
      {toast.msg}
    </div>
  );
}

/* ─── Upload Section ─── */
function UploadSection({ onUploadSuccess }) {
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [name,    setName]    = useState("");
  const [role,    setRole]    = useState("");
  const [caption, setCaption] = useState("");
  const [uploading,setUploading]=useState(false);
  const [progress, setProgress]=useState(0);
  const [toast,   setToast]   = useState(null);
  const [drag,    setDrag]    = useState(false);
  const fileRef = useRef(null);

  const showToast=(msg,type="success")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3200);
  };

  const handleFile=(f)=>{
    if(!f||!f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload=async()=>{
    if(!file)      return showToast("Please select a photo first! 🌸","error");
    if(!name.trim())return showToast("Please enter your name! 🙏","error");
    setUploading(true); setProgress(20);
    const fd=new FormData();
    fd.append("image",file); fd.append("name",name);
    fd.append("member",role); fd.append("caption",caption);
    try{
      setProgress(55);
      const res=await fetch(`${API_BASE}/upload`,{method:"POST",body:fd});
      setProgress(90);
      if(!res.ok) throw new Error();
      setProgress(100);
      showToast("Jai Shri Krishna! Uploaded! 🎉🌸");
      setFile(null);setPreview(null);setName("");setRole("");setCaption("");
      setTimeout(()=>{setProgress(0);onUploadSuccess();},600);
    }catch{
      showToast("Upload failed. Try again ❌","error");
      setProgress(0);
    }finally{setUploading(false);}
  };

  return (
    <section className="relative z-10 w-full max-w-md mx-auto px-3 mb-8">
      <Toast toast={toast}/>
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-orange-100 p-4"
        style={{boxShadow:"0 12px 40px rgba(251,146,60,0.13),0 2px 12px rgba(0,0,0,0.07)"}}>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200"/>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
            📸 Upload Your Holi Moment
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-pink-200"/>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDrag(true);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
            ${drag?"border-orange-400 bg-orange-50":"border-orange-200 bg-gradient-to-br from-orange-50/60 to-pink-50/60 hover:border-orange-300"}`}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e=>handleFile(e.target.files[0])}/>
          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview"
                className="w-full max-h-40 object-cover rounded-xl"/>
              <div className="absolute inset-0 bg-black/25 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-xs bg-black/50 px-3 py-1.5 rounded-full">Change Photo</span>
              </div>
            </div>
          ):(
            <div className="flex flex-col items-center justify-center py-6 gap-1">
              <div className="text-3xl">🖼️</div>
              <p className="font-bold text-gray-500 text-sm">Click or drag & drop photo</p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP • Max 10MB</p>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 block">Your Name</label>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="e.g. Radha Devi" maxLength={40}
              className="w-full px-3 py-2.5 rounded-xl bg-white/80 border-2 border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-gray-700 font-semibold text-sm placeholder-gray-300 transition-all"/>
          </div>
          <div>
            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 block">Family Role</label>
            <RoleDropdown value={role} onChange={setRole}/>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 block">
              Caption <span className="text-gray-300 normal-case font-normal">(optional)</span>
            </label>
            <input value={caption} onChange={e=>setCaption(e.target.value)}
              placeholder="Jai Shri Krishna! 🙏" maxLength={100}
              className="w-full px-3 py-2.5 rounded-xl bg-white/80 border-2 border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-gray-700 font-semibold text-sm placeholder-gray-300 transition-all"/>
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-3 h-1.5 rounded-full bg-orange-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{width:`${progress}%`,background:"linear-gradient(90deg,#fb923c,#ec4899,#a855f7)"}}/>
          </div>
        )}

        {/* Button */}
        <button onClick={handleUpload} disabled={uploading}
          className="w-full mt-3 py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{background:"linear-gradient(135deg,#fb923c,#ec4899,#a855f7)",
            boxShadow:"0 6px 20px rgba(251,146,60,0.35)"}}>
          <span className="relative z-10">
            {uploading ? "🌺 Uploading..." : "🌸 Upload & Share Joy 🌸"}
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"/>
        </button>
      </div>
    </section>
  );
}

/* ─── Image Card ─── */
function ImageCard({ img, index, onClick }) {
  const url     = img.imageUrl||img.url||img.image||img.path||"";
  const uname   = img.name||img.uploaderName||"Krishna Bhakt";
  const member  = img.member||img.role||"";
  const caption = img.caption||"";

  return (
    <div onClick={()=>onClick({url,uname,member,caption})}
      className="break-inside-avoid mb-3 rounded-xl overflow-hidden cursor-pointer group relative bg-white shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{animation:`cardIn .4s ease ${index*.05}s both`}}>
      <div className="overflow-hidden">
        <img src={url} alt={uname} loading="lazy"
          className="w-full block group-hover:scale-105 transition-transform duration-500"
          onError={e=>{e.target.src=`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='%23fff7ed'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='50'>🌸</text></svg>`;}}/>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white font-bold text-xs leading-tight">{uname}</p>
        {member && (
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white w-fit"
            style={{background:`linear-gradient(135deg,${roleGrad(member)})`}}>
            {roleEmoji(member)} {member}
          </span>
        )}
        {caption && <p className="text-white/75 text-[10px] mt-0.5 italic line-clamp-1">❝{caption}❞</p>}
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ data, onClose }) {
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",h);
    return()=>document.removeEventListener("keydown",h);
  },[onClose]);

  if(!data) return null;
  const {url,uname,member,caption}=data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      onClick={onClose}
      style={{background:"rgba(255,247,237,0.88)",backdropFilter:"blur(18px)"}}>
      <div className="relative w-full max-w-lg"
        onClick={e=>e.stopPropagation()}
        style={{animation:"scaleIn .28s cubic-bezier(.175,.885,.32,1.275)"}}>
        <button onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full text-white font-bold shadow-xl flex items-center justify-center hover:scale-110 transition-transform text-sm"
          style={{background:"linear-gradient(135deg,#fb923c,#ec4899)"}}>✕</button>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-orange-100">
          <img src={url} alt={uname} className="w-full max-h-[62vh] object-contain bg-orange-50"/>
          <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 flex items-center gap-3">
            {member && (
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow flex-shrink-0"
                style={{background:`linear-gradient(135deg,${roleGrad(member)})`}}>
                {roleEmoji(member)}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{uname}</p>
              {member && <p className="text-xs font-semibold text-orange-500">{member}</p>}
              {caption && <p className="text-gray-400 italic text-xs mt-0.5 truncate">❝{caption}❞</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton ─── */
function Skeleton({h=180}) {
  return (
    <div className="break-inside-avoid mb-3 rounded-xl"
      style={{height:h,background:"linear-gradient(90deg,#fff0e8,#fde8f0,#fff0e8)",
        backgroundSize:"200%",animation:"skelShimmer 1.4s ease infinite"}}/>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [images,  setImages]  = useState([]);
  const [filter,  setFilter]  = useState("All");
  const [loading, setLoading] = useState(true);
  const [lightbox,setLightbox]= useState(null);

  const loadGallery=useCallback(async()=>{
    try{
      const res=await fetch(`${API_BASE}/`);
      const d=await res.json();
      setImages(Array.isArray(d)?d:(d.images||d.data||[]));
    }catch{}finally{setLoading(false);}
  },[]);

  useEffect(()=>{
    loadGallery();
    const t=setInterval(loadGallery,30000);
    return()=>clearInterval(t);
  },[loadGallery]);

  const filtered=filter==="All"?images:images.filter(i=>(i.member||i.role)===filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *{font-family:'Nunito',sans-serif;}
        h1,h2{font-family:'Playfair Display',serif;}
        @keyframes petalFall{
          0%{transform:translateY(-30px) rotate(0deg);opacity:.8}
          100%{transform:translateY(110vh) rotate(720deg);opacity:0}
        }
        @keyframes cardIn{
          from{opacity:0;transform:translateY(14px) scale(.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes scaleIn{
          from{opacity:0;transform:scale(.88)}
          to{opacity:1;transform:scale(1)}
        }
        @keyframes dropIn{
          from{opacity:0;transform:translateY(-8px) scale(.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes slideUp{
          from{opacity:0;transform:translateX(-50%) translateY(18px)}
          to{opacity:1;transform:translateX(-50%) translateY(0)}
        }
        @keyframes shimmerTitle{
          0%{background-position:0% 50%}
          100%{background-position:300% 50%}
        }
        @keyframes skelShimmer{
          0%,100%{background-position:200% 0}
          50%{background-position:0% 0}
        }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#fb923c,#ec4899);border-radius:5px}
      `}</style>

      <div className="min-h-screen relative"
        style={{background:"linear-gradient(135deg,#fff7ed 0%,#fdf2f8 40%,#faf5ff 70%,#f0fdfa 100%)"}}>

        {/* BG blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full opacity-[0.18]"
            style={{background:"radial-gradient(circle,#fb923c,transparent)"}}/>
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-[0.18]"
            style={{background:"radial-gradient(circle,#ec4899,transparent)"}}/>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full opacity-[0.13]"
            style={{background:"radial-gradient(circle,#a855f7,transparent)"}}/>
          <div className="absolute bottom-16 right-0 w-60 h-60 rounded-full opacity-[0.13]"
            style={{background:"radial-gradient(circle,#14b8a6,transparent)"}}/>
        </div>

        <Petals/>

        {/* Header */}
        <header className="relative z-10 text-center pt-10 pb-6 px-4">
          <div className="text-2xl mb-1 animate-bounce inline-block">🦚</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 leading-tight"
            style={{
              background:"linear-gradient(135deg,#f97316,#ec4899,#a855f7,#f97316)",
              backgroundSize:"300%",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              animation:"shimmerTitle 5s linear infinite"
            }}>
            Holi Utsav Gallery
          </h1>
          <p className="text-gray-400 text-sm font-medium">Our Family's Colourful Holi Memories 🌈</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-300"/>
            <span className="text-xl">🌸</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-300"/>
          </div>
        </header>

        {/* Upload */}
        <UploadSection onUploadSuccess={loadGallery}/>

        {/* Gallery */}
        <section className="relative z-10 max-w-7xl mx-auto px-3 pb-16">
          <div className="text-center mb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-700 mb-1">
              Family Photo Collection 🌺
            </h2>
            <p className="text-gray-400 text-xs">{images.length} memories shared</p>
          </div>

          {/* Filter Tabs — horizontally scrollable on mobile */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 px-0.5 scrollbar-none"
            style={{scrollbarWidth:"none",msOverflowStyle:"none"}}>
            {FILTERS.map(f=>{
              const active=filter===f;
              const r=FAMILY_ROLES.find(x=>x.label===f);
              const grad=f==="All"?"#f97316,#ec4899,#a855f7":roleGrad(f);
              return (
                <button key={f} onClick={()=>setFilter(f)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 border-2
                    ${active?"text-white border-transparent shadow-md scale-105"
                      :"text-gray-500 border-gray-200 bg-white/70 hover:border-orange-300 hover:text-orange-500"}`}
                  style={active?{background:`linear-gradient(135deg,${grad})`,
                    boxShadow:"0 3px 12px rgba(249,115,22,0.3)"}:{}}>
                  <span>{f==="All"?"🌈":r?.emoji}</span>
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{columns:"3 150px",columnGap:"12px"}}>
              {[180,220,160,200,170,210,160,190].map((h,i)=><Skeleton key={i} h={h}/>)}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">🪔</div>
              <p className="text-gray-400 font-semibold">No photos yet!</p>
              <p className="text-gray-300 text-xs mt-1">Be the first to share your Holi joy 🌸</p>
            </div>
          ) : (
            <div style={{columns:"3 150px",columnGap:"12px"}}>
              {filtered.map((img,i)=>(
                <ImageCard key={img._id||i} img={img} index={i} onClick={setLightbox}/>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 border-t border-orange-100 text-gray-400 text-xs">
          <div className="text-xl mb-1.5">🌸 🦚 🌸</div>
          <p className="font-semibold text-gray-500 text-sm">Radha Krishna Holi Utsav</p>
          <p className="mt-0.5 text-gray-300">Hare Krishna • Hare Hare</p>
          <p className="mt-1.5">Made with <span className="text-pink-400">♥</span> for our beloved family</p>
        </footer>
      </div>

      <Lightbox data={lightbox} onClose={()=>setLightbox(null)}/>
    </>
  );
}