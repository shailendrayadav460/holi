import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://backend-holi-images-1.onrender.com/api/holi";

const FAMILY_ROLES = [
  { label: "Dadi / Nani",     emoji: "👵", grad: "#f87171,#ec4899" },
  { label: "Dada / Nana",     emoji: "👴", grad: "#fb923c,#f97316" },
  { label: "Papa / Kaka",     emoji: "👨", grad: "#60a5fa,#818cf8" },
  { label: "Maa / Mami",      emoji: "👩", grad: "#f472b6,#fb7185" },
  { label: "Bhaiya / Bhai",   emoji: "🧑", grad: "#2dd4bf,#22d3ee" },
  { label: "Didi / Behen",    emoji: "👧", grad: "#c084fc,#a855f7" },
  { label: "Chote / Bachche", emoji: "🧒", grad: "#fbbf24,#f59e0b" },
  { label: "Mausa / Mausi",   emoji: "🧑‍🤝‍🧑", grad: "#34d399,#10b981" },
  { label: "Fufa / Bua",      emoji: "👫", grad: "#e879f9,#ec4899" },
  { label: "Other",           emoji: "🙏", grad: "#fb923c,#ef4444" },
];

const FILTERS = [
  "All","Dadi / Nani","Dada / Nana","Papa / Kaka",
  "Maa / Mami","Bhaiya / Bhai","Didi / Behen","Chote / Bachche"
];

const roleGrad  = (l) => FAMILY_ROLES.find(x=>x.label===l)?.grad  || "#fb923c,#ec4899";
const roleEmoji = (l) => FAMILY_ROLES.find(x=>x.label===l)?.emoji || "🙏";

/* ── Petals ── */
function Petals() {
  const list = ["🌸","🌺","🏵️","🌷","🪷","✨","🌼","🎨"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
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

/* ── Custom Dropdown ── */
function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return ()=> document.removeEventListener("mousedown", h);
  },[]);

  const sel = FAMILY_ROLES.find(r => r.label === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={()=>setOpen(o=>!o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all focus:outline-none shadow-sm"
        style={{background:"rgba(255,255,255,0.85)"}}
      >
        <span className="flex items-center gap-2">
          {sel ? (
            <>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{background:`linear-gradient(135deg,${sel.grad})`,boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}>
                {sel.emoji}
              </span>
              <span className="font-semibold text-gray-700 text-sm">{sel.label}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm font-medium">Select Family Role</span>
          )}
        </span>
        <span style={{
          color:"#fb923c",
          fontSize:"0.85rem",
          display:"inline-block",
          transition:"transform 0.3s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)"
        }}>▾</span>
      </button>

      {open && (
        <div
          className="absolute w-full mt-1 rounded-2xl bg-white border border-orange-100 overflow-hidden"
          style={{
            zIndex:9999,
            boxShadow:"0 20px 60px rgba(0,0,0,0.15)",
            animation:"dropIn 0.2s cubic-bezier(0.175,0.885,0.32,1.275)"
          }}
        >
          <div className="p-1.5 max-h-60 overflow-y-auto">
            {FAMILY_ROLES.map(role=>(
              <button
                key={role.label}
                type="button"
                onClick={()=>{ onChange(role.label); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left mb-0.5"
                style={value===role.label
                  ? {background:`linear-gradient(135deg,${role.grad})`,boxShadow:"0 2px 10px rgba(0,0,0,0.12)"}
                  : {}}
                onMouseEnter={e=>{ if(value!==role.label) e.currentTarget.style.background="#fff7ed"; }}
                onMouseLeave={e=>{ if(value!==role.label) e.currentTarget.style.background=""; }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{background: value===role.label ? "rgba(255,255,255,0.25)" : `linear-gradient(135deg,${role.grad})`}}
                >
                  {role.emoji}
                </span>
                <span className="font-semibold text-sm" style={{color: value===role.label ? "white" : "#374151"}}>
                  {role.label}
                </span>
                {value===role.label && (
                  <span className="ml-auto text-white font-bold text-sm">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toast ── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed left-1/2 font-semibold text-sm text-white px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap"
      style={{
        bottom:"20px",
        transform:"translateX(-50%)",
        zIndex:99999,
        background: toast.type==="error"
          ? "linear-gradient(135deg,#ef4444,#dc2626)"
          : "linear-gradient(135deg,#fb923c,#ec4899)",
        boxShadow:"0 8px 25px rgba(251,146,60,0.45)",
        animation:"slideUp 0.3s ease"
      }}
    >
      {toast.msg}
    </div>
  );
}

/* ── Upload Section ── */
function UploadSection({ onUploadSuccess }) {
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [name,      setName]      = useState("");
  const [role,      setRole]      = useState("");
  const [caption,   setCaption]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [toast,     setToast]     = useState(null);
  const [drag,      setDrag]      = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(()=>setToast(null), 3200);
  };

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file)        return showToast("Please select a photo first! 🌸","error");
    if (!name.trim()) return showToast("Please enter your name! 🙏","error");
    setUploading(true); setProgress(20);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("title", name);
    fd.append("name", name);
    fd.append("member", role);
    fd.append("caption", caption);
    try {
      setProgress(55);
      const res = await fetch(`${API_BASE}/upload`, { method:"POST", body:fd });
      setProgress(90);
      if (!res.ok) { const t = await res.text(); console.error("Upload error:", res.status, t); throw new Error(t); }
      setProgress(100);
      showToast("Jai Shri Krishna! Uploaded! 🎉🌸");
      setFile(null); setPreview(null); setName(""); setRole(""); setCaption("");
      setTimeout(()=>{ setProgress(0); onUploadSuccess(); }, 600);
    } catch {
      showToast("Upload failed. Try again ❌","error");
      setProgress(0);
    } finally { setUploading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none text-gray-700 font-semibold text-sm placeholder-gray-300 transition-all";

  return (
    <section className="relative w-full max-w-md mx-auto px-3 mb-8" style={{zIndex:10}}>
      <Toast toast={toast}/>
      <div
        className="rounded-2xl border border-orange-100 p-4"
        style={{
          background:"rgba(255,255,255,0.88)",
          backdropFilter:"blur(16px)",
          boxShadow:"0 12px 40px rgba(251,146,60,0.13), 0 2px 12px rgba(0,0,0,0.07)"
        }}
      >
        {/* Card Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1" style={{background:"linear-gradient(to right, transparent, #fed7aa)"}}/>
          <div
            className="flex items-center gap-1 text-white px-4 py-1.5 rounded-full text-xs font-bold"
            style={{background:"linear-gradient(135deg,#fb923c,#ec4899)",boxShadow:"0 4px 14px rgba(251,146,60,0.35)"}}
          >
            📸 Upload Your Holi Moment
          </div>
          <div className="h-px flex-1" style={{background:"linear-gradient(to left, transparent, #fbcfe8)"}}/>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDrag(true);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>fileRef.current?.click()}
          className="relative border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden"
          style={{
            borderColor: drag ? "#fb923c" : "#fed7aa",
            background: drag ? "#fff7ed" : "linear-gradient(135deg,rgba(255,247,237,0.7),rgba(253,242,248,0.7))"
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e=>handleFile(e.target.files[0])}/>
          {preview ? (
            <div className="relative group">
              <img src={preview} alt="preview" className="w-full object-cover rounded-xl" style={{maxHeight:"160px"}}/>
              <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{background:"rgba(0,0,0,0.25)"}}>
                <span className="text-white font-bold text-xs px-3 py-1 rounded-full" style={{background:"rgba(0,0,0,0.5)"}}>Change Photo</span>
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

        {/* Form Fields */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-orange-500 font-bold mb-1" style={{fontSize:"10px",letterSpacing:"0.05em",textTransform:"uppercase"}}>Your Name</label>
            <input
              value={name} onChange={e=>setName(e.target.value)}
              placeholder="e.g. Radha Devi" maxLength={40}
              className={inputCls}
              style={{background:"rgba(255,255,255,0.85)"}}
            />
          </div>
          <div>
            <label className="block text-orange-500 font-bold mb-1" style={{fontSize:"10px",letterSpacing:"0.05em",textTransform:"uppercase"}}>Family Role</label>
            <RoleDropdown value={role} onChange={setRole}/>
          </div>
          <div className="col-span-2">
            <label className="block text-orange-500 font-bold mb-1" style={{fontSize:"10px",letterSpacing:"0.05em",textTransform:"uppercase"}}>
              Caption <span className="text-gray-300 normal-case font-normal text-xs">(optional)</span>
            </label>
            <input
              value={caption} onChange={e=>setCaption(e.target.value)}
              placeholder="Jai Shri Krishna! 🙏" maxLength={100}
              className={inputCls}
              style={{background:"rgba(255,255,255,0.85)"}}
            />
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{background:"#ffedd5"}}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{width:`${progress}%`,background:"linear-gradient(90deg,#fb923c,#ec4899,#a855f7)"}}/>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-3 py-3 rounded-xl font-bold text-white text-sm transition-all relative overflow-hidden"
          style={{
            background:"linear-gradient(135deg,#fb923c,#ec4899,#a855f7)",
            boxShadow:"0 6px 20px rgba(251,146,60,0.38)",
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? "not-allowed" : "pointer"
          }}
        >
          {uploading ? "🌺 Uploading..." : "🌸 Upload & Share Joy 🌸"}
        </button>
      </div>
    </section>
  );
}

/* ── Fix image URL: API returns localhost URLs, replace with actual backend host ── */
function fixImageUrl(raw) {
  if (!raw) return "";
  // API stores images as http://localhost:5000/... — replace with render backend
  if (raw.includes("localhost:5000")) {
    return raw.replace("http://localhost:5000", "https://backend-holi-images-1.onrender.com");
  }
  return raw;
}

/* ── Image Card ── */
function ImageCard({ img, index, onClick }) {
  // API returns: { _id, title, image, createdAt }
  const url     = fixImageUrl(img.image || "");
  const uname   = img.title || img.name || "Krishna Bhakt";
  const member  = img.member || img.role || "";
  const caption = img.caption || "";
  const date    = img.createdAt ? new Date(img.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "";

  return (
    <div
      onClick={()=>onClick({url,uname,member,caption})}
      className="rounded-xl overflow-hidden cursor-pointer relative bg-white"
      style={{
        breakInside:"avoid",
        marginBottom:"12px",
        boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
        transition:"all 0.3s ease",
        animation:`cardIn 0.4s ease ${index*0.05}s both`
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.15)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.08)";}}
    >
      <div className="overflow-hidden">
        <img
          src={url} alt={uname} loading="lazy"
          className="w-full block transition-transform duration-500"
          style={{display:"block"}}
          onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.target.style.transform=""}
          onError={e=>{e.target.src=`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='%23fff7ed'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='50'>🌸</text></svg>`;}}
        />
      </div>
      {/* Hover Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300"
        style={{background:"linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)"}}
        onMouseEnter={e=>e.currentTarget.style.opacity="1"}
        onMouseLeave={e=>e.currentTarget.style.opacity="0"}
      >
        <p className="text-white font-bold text-xs leading-tight">{uname}</p>
        {member && (
          <span
            className="inline-flex items-center gap-1 mt-1 text-white font-bold px-2 py-0.5 rounded-full w-fit"
            style={{fontSize:"10px",background:`linear-gradient(135deg,${roleGrad(member)})`}}
          >
            {roleEmoji(member)} {member}
          </span>
        )}
        {caption && <p className="text-white mt-0.5 italic" style={{fontSize:"10px",opacity:0.8}}>❝{caption}❞</p>}
        {date && <p className="text-white mt-0.5" style={{fontSize:"10px",opacity:0.6}}>📅 {date}</p>}
      </div>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({ data, onClose }) {
  useEffect(()=>{
    const h = e => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return ()=> document.removeEventListener("keydown", h);
  },[onClose]);

  if (!data) return null;
  const {url, uname, member, caption} = data;
  const fixedUrl = fixImageUrl(url);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3"
      style={{zIndex:50000, background:"rgba(255,247,237,0.88)", backdropFilter:"blur(18px)"}}
      onClick={onClose}
    >
      <div
        className="relative w-full"
        style={{maxWidth:"520px", animation:"scaleIn 0.28s cubic-bezier(0.175,0.885,0.32,1.275)"}}
        onClick={e=>e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-white font-bold flex items-center justify-center hover:scale-110 transition-transform"
          style={{
            top:"-12px", right:"-12px", width:"36px", height:"36px", borderRadius:"50%",
            background:"linear-gradient(135deg,#fb923c,#ec4899)",
            boxShadow:"0 4px 14px rgba(251,146,60,0.4)", zIndex:1, fontSize:"0.9rem",
            border:"none", cursor:"pointer"
          }}
        >✕</button>
        <div className="rounded-2xl overflow-hidden" style={{boxShadow:"0 25px 60px rgba(0,0,0,0.2)", border:"1px solid #fed7aa"}}>
          <img src={fixedUrl} alt={uname} className="w-full object-contain" style={{maxHeight:"62vh", background:"#fff7ed"}}/>
          <div className="px-4 py-3 flex items-center gap-3" style={{background:"linear-gradient(135deg,#fff7ed,#fdf2f8)"}}>
            {member && (
              <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                style={{background:`linear-gradient(135deg,${roleGrad(member)})`,boxShadow:"0 3px 10px rgba(0,0,0,0.12)"}}>
                {roleEmoji(member)}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{uname}</p>
              {member  && <p className="text-xs font-semibold text-orange-500">{member}</p>}
              {caption && <p className="text-gray-400 italic text-xs mt-0.5 truncate">❝{caption}❞</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton({h=180}) {
  return (
    <div
      className="rounded-xl"
      style={{
        height:h, breakInside:"avoid", marginBottom:"12px",
        background:"linear-gradient(90deg,#fff0e8 25%,#fde8f0 50%,#fff0e8 75%)",
        backgroundSize:"200%",
        animation:"skelShimmer 1.4s ease infinite"
      }}
    />
  );
}

/* ── Main App ── */
export default function App() {
  const [images,   setImages]   = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null);

  const loadGallery = useCallback(async()=>{
    try{
      const res = await fetch(`${API_BASE}/`);
      const d   = await res.json();
      setImages(Array.isArray(d) ? d : (d.images||d.data||[]));
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(()=>{
    loadGallery();
    const t = setInterval(loadGallery, 30000);
    return ()=> clearInterval(t);
  },[loadGallery]);

  const filtered = filter==="All" ? images : images.filter(i=>(i.member||i.role||"")===filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        * { font-family: 'Nunito', sans-serif; box-sizing: border-box; }
        h1, h2 { font-family: 'Playfair Display', serif; }
        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(18px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes shimmerTitle {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes skelShimmer {
          0%,100% { background-position: 200% 0; }
          50%     { background-position: 0% 0; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#fb923c,#ec4899); border-radius: 5px; }
      `}</style>

      <div
        className="min-h-screen relative"
        style={{background:"linear-gradient(135deg,#fff7ed 0%,#fdf2f8 40%,#faf5ff 70%,#f0fdfa 100%)"}}
      >
        {/* BG blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
          <div className="absolute rounded-full" style={{top:"-112px",left:"-112px",width:"320px",height:"320px",background:"radial-gradient(circle,#fb923c,transparent)",opacity:0.18}}/>
          <div className="absolute rounded-full" style={{top:"-64px",right:"-64px",width:"288px",height:"288px",background:"radial-gradient(circle,#ec4899,transparent)",opacity:0.18}}/>
          <div className="absolute rounded-full" style={{bottom:"0",left:"33%",width:"320px",height:"320px",background:"radial-gradient(circle,#a855f7,transparent)",opacity:0.13}}/>
          <div className="absolute rounded-full" style={{bottom:"64px",right:"0",width:"240px",height:"240px",background:"radial-gradient(circle,#14b8a6,transparent)",opacity:0.13}}/>
        </div>

        <Petals/>

        {/* Header */}
        <header className="relative text-center pt-10 pb-6 px-4" style={{zIndex:10}}>
          <div className="text-2xl mb-1 inline-block" style={{animation:"bounce 1s infinite"}}>🦚</div>
          <h1
            className="font-extrabold mb-2 leading-tight"
            style={{
              fontSize:"clamp(1.8rem,5vw,3rem)",
              background:"linear-gradient(135deg,#f97316,#ec4899,#a855f7,#f97316)",
              backgroundSize:"300%",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              animation:"shimmerTitle 5s linear infinite"
            }}
          >
            Holi Utsav Gallery
          </h1>
          <p className="text-gray-400 text-sm font-medium">Our Family's Colourful Holi Memories 🌈</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16" style={{background:"linear-gradient(to right,transparent,#fdba74)"}}/>
            <span className="text-xl">🌸</span>
            <div className="h-px w-16" style={{background:"linear-gradient(to left,transparent,#f9a8d4)"}}/>
          </div>
        </header>

        {/* Upload */}
        <UploadSection onUploadSuccess={loadGallery}/>

        {/* Gallery */}
        <section className="relative mx-auto px-3 pb-16" style={{zIndex:10, maxWidth:"1280px"}}>
          <div className="text-center mb-5">
            <h2 className="font-extrabold text-gray-700 mb-1" style={{fontSize:"clamp(1.4rem,3vw,2rem)"}}>
              Family Photo Collection 🌺
            </h2>
            <p className="text-gray-400 text-xs">{images.length} memories shared</p>
          </div>

          {/* Filter Tabs */}
          <div
            className="flex gap-2 mb-6 pb-1"
            style={{overflowX:"auto",scrollbarWidth:"none",msOverflowStyle:"none"}}
          >
            {FILTERS.map(f=>{
              const active = filter===f;
              const r = FAMILY_ROLES.find(x=>x.label===f);
              const grad = f==="All" ? "#f97316,#ec4899,#a855f7" : roleGrad(f);
              return (
                <button
                  key={f}
                  onClick={()=>setFilter(f)}
                  className="flex items-center gap-1 font-bold whitespace-nowrap flex-shrink-0 border-2 transition-all"
                  style={{
                    padding:"6px 14px",
                    borderRadius:"9999px",
                    fontSize:"12px",
                    borderColor: active ? "transparent" : "#e5e7eb",
                    color: active ? "white" : "#6b7280",
                    background: active ? `linear-gradient(135deg,${grad})` : "rgba(255,255,255,0.8)",
                    boxShadow: active ? "0 3px 12px rgba(249,115,22,0.3)" : "none",
                    transform: active ? "scale(1.05)" : "scale(1)",
                    cursor:"pointer"
                  }}
                >
                  <span>{f==="All" ? "🌈" : r?.emoji}</span>
                  {f}
                </button>
              );
            })}
          </div>

          {/* Masonry Grid */}
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
        <footer className="relative text-center py-6 text-gray-400 text-xs" style={{zIndex:10,borderTop:"1px solid #ffedd5"}}>
          <div className="text-xl mb-1">🌸 🦚 🌸</div>
          <p className="font-semibold text-gray-500 text-sm">Radha Krishna Holi Utsav</p>
          <p className="mt-0.5 text-gray-300">Hare Krishna • Hare Hare</p>
          <p className="mt-1">Made with <span style={{color:"#f472b6"}}>♥</span> for our beloved family</p>
        </footer>
      </div>

      <Lightbox data={lightbox} onClose={()=>setLightbox(null)}/>
    </>
  );
}