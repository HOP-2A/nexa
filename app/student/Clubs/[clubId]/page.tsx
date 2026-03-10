"use client";

import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Users2, 
  Calendar as CalendarIcon, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ImageIcon,
  MessageSquare,
  ArrowUpRight,
  X,
  Radio
} from "lucide-react";
import SideBar from "@/app/_component/sideBar";

// --- Төрлүүд ---
type PostType = {
  clubId: string;
  content: string;
  createdAt: string;
  id: string;
  image: string[];
  status: string;
  studentId: string;
  title: string;
  updatedAt: string;
};

const Page = () => {
  const params = useParams();
  const clubId = params.clubId as string;
  const { push } = useRouter();
  const { isLoaded, user } = useUser();

  // Төлөв Мененежмент
  const [club, setClub] = useState<any>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [caption, setCaption] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Клуб болон Постын өгөгдөл татах
  useEffect(() => {
    if (!clubId || !user) return;
    const fetchClubData = async () => {
      const res = await fetch(`/api/club-management/bring-club-info/${clubId}`);
      if (res.ok) setClub(await res.json());
    };
    fetchClubData();
  }, [isLoaded, user, clubId]);

  useEffect(() => {
    if (club?.id) BringPost();
  }, [club?.id]);

  const BringPost = async () => {
    const res = await fetch(`/api/club-management/bring-posts/${club?.id}`);
    if (res.ok) setPosts(await res.json());
  };

  // 2. Зураг боловсруулах логик
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Файл татгалзлаа", { description: "Файлын хэмжээ 5MB-аас хэтэрсэн байна." });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImage(url);
    toast.success("Обьект бэлэн", { description: "Зургийг илгээхэд бэлэн боллоо." });
  };

  // 3. Пост үүсгэх
  const CreatePost = async () => {
    if (!caption || !details) {
      toast.error("Дамжуулалтын алдаа", { description: "Гарчиг болон агуулга заавал байх ёстой." });
      return;
    }

    const res = await fetch("/api/club-management/create-post", {
      method: "POST",
      body: JSON.stringify({
        clubId: club?.id,
        title: caption,
        content: details,
        studentClerk: user?.id,
        image: image, 
      }),
    });

    if (res.ok) {
      toast.success("Мэдээлэл дамжуулагдлаа", { description: "Клубын сүлжээнд амжилттай нийтлэгдлээ." });
      setCaption("");
      setDetails("");
      setImage(null);
      setFile(null);
      BringPost();
    } else {
      toast.error("Дамжуулалт тасалдлаа");
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex text-zinc-100 selection:bg-indigo-500/30">
      
      <SideBar
        activeTab="news"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Орчин */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[140px] -z-10" />

        {/* ДЭЭД ЦЭС */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020202]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-[0_0_25px_rgba(79,70,229,0.4)] border border-white/10">
              {club?.name?.substring(0, 2).toUpperCase() || "NX"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Сүлжээний Зангилаа</span>
              <span className="text-zinc-800">/</span>
              <h1 className="text-xs font-black text-white uppercase tracking-widest italic">{club?.name || "Ачаалж байна..."}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Radio size={12} className="text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Шууд Холболт</span>
            </div>
          </div>
        </header>

        {/* АЖЛЫН ХЭСЭГ */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* ЗҮҮН ТАЛ: НИЙТЛЭЛ ҮҮСГЭХ БОЛОН УРСГАЛ */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* НИЙТЛЭЛ БИЧИХ ХЭСЭГ */}
              <section className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative group overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <Zap size={16} className="text-indigo-500" />
                    <input
                      value={caption}
                      placeholder="Дамжуулалтын гарчиг..."
                      className="bg-transparent text-xl font-black uppercase italic tracking-tighter text-white outline-none w-full placeholder:text-zinc-800"
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                  
                  <textarea
                    value={details}
                    placeholder="Клубын гишүүдэд мэдээлэл илгээх..."
                    rows={3}
                    className="w-full bg-transparent text-zinc-400 text-sm font-medium resize-none outline-none placeholder:text-zinc-700"
                    onChange={(e) => setDetails(e.target.value)}
                  />

                  {/* ХАРАГДАЦЫН ХЭСЭГ */}
                  <AnimatePresence>
                    {image && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group/img"
                      >
                        <img src={image} className="w-full h-64 object-cover opacity-60 group-hover/img:opacity-80 transition-opacity" />
                        <button 
                          onClick={() => { setImage(null); setFile(null); }}
                          className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-6">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest ${image ? 'text-indigo-400' : 'text-zinc-500 hover:text-white'}`}
                      >
                        <ImageIcon size={14} /> {image ? "Файл бэхлэгдсэн" : "Файл хавсаргах"}
                      </button>
                    </div>
                    <button
                      onClick={CreatePost}
                      disabled={!caption || !details}
                      className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20 shadow-xl active:scale-95"
                    >
                      Дамжуулах
                    </button>
                  </div>
                </div>
              </section>

              {/* МЭДЭЭЛЛИЙН УРСГАЛ */}
              <div className="space-y-8">
                <div className="flex items-center gap-6 px-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">Мэдээллийн урсгал</h2>
                  <div className="h-px w-full bg-white/5" />
                </div>

                <div className="grid gap-6">
                  {posts?.length > 0 ? (
                    posts.map((post, idx) => (
                      <motion.article
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={post.id}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/20 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-8">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                                 <img src={user?.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Илгээгч: Админ</p>
                                 <p className="text-[9px] font-bold text-zinc-600 uppercase mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <ArrowUpRight size={16} className="text-zinc-800 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium mb-6">{post.content}</p>
                        
                        {post.image && post.image.length > 0 && (
                          <div className="rounded-2xl overflow-hidden border border-white/5 mb-6">
                             <img src={post.image[0]} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
                          </div>
                        )}

                        <div className="flex items-center gap-6 border-t border-white/5 pt-6">
                           <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                             <MessageSquare size={14} /> Харилцан үйлчлэл
                           </button>
                        </div>
                      </motion.article>
                    ))
                  ) : (
                    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Үндсэн дамжуулалт хүлээгдэж байна</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* БАРУУН ТАЛ: УХААЛАГ МЭДЭЭЛЭЛ */}
            <aside className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-all" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-2">
                  <Users2 size={12} /> Синхрончлол
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-6xl font-black tracking-tighter italic text-white leading-none">
                      {club?.clubToStudents?.length || 0}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mt-3">Идэвхтэй гишүүд</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
                     <CalendarIcon size={12} /> Арга хэмжээ
                   </h3>
                </div>
                <div className="space-y-3">
                  {club?.events?.length > 0 ? (
                    club.events.map((event: any) => (
                      <div key={event.eventId} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/40 transition-all group cursor-pointer">
                        <p className="text-[11px] font-black uppercase italic text-zinc-300 group-hover:text-white transition-colors">{event.title}</p>
                        <p className="text-[9px] font-bold text-zinc-600 mt-1 uppercase tracking-tighter">БАЙРШИЛ // {event.location}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9px] font-black text-zinc-800 uppercase text-center py-6 border border-dashed border-white/5 rounded-xl">Одоогоор арга хэмжээ байхгүй</p>
                  )}
                </div>
              </div>

              <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4 group">
                 <ShieldCheck size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                 <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed text-zinc-500">
                   NEXA Протокол: Хамгаалагдсан холболт идэвхтэй байна.
                 </p>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Page;