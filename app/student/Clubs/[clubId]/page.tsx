"use client";

import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Users2, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Zap, 
  ImageIcon,
  MessageSquare,
  ArrowUpRight,
  X,
  Radio,
  Menu
} from "lucide-react";
import SideBar from "@/app/_component/sideBar";

// --- Types ---
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
  const clubId = params?.clubId as string;
  const { push } = useRouter();
  const { isLoaded, user } = useUser();

  // State Management
  const [club, setClub] = useState<any>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [caption, setCaption] = useState("");
  const [details, setDetails] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Data
  const bringPosts = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/club-management/bring-posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Post fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !user || !clubId) return;
    
    const fetchClubData = async () => {
      try {
        const res = await fetch(`/api/club-management/bring-club-info/${clubId}`);
        if (res.ok) {
          const data = await res.json();
          setClub(data);
          if (data?.id) bringPosts(data.id);
        }
      } catch (err) {
        toast.error("Клубын мэдээлэл татахад алдаа гарлаа");
      }
    };

    fetchClubData();
  }, [isLoaded, user, clubId, bringPosts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
  
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Файл 5MB-аас их байна");
      return;
    }
  
    setFile(selectedFile);
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  const createPost = async () => {
    if (!caption || !details || isSubmitting) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
  
      formData.append("clubId", club?.id);
      formData.append("studentClerk", user?.id || "");
      formData.append("title", caption);
      formData.append("content", details);
  
      if (file) {
        formData.append("file", file);
      }
  
      const res = await fetch("/api/club-management/create-post", {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        toast.success("Post created");
  
        setCaption("");
        setDetails("");
        setImagePreview(null);
        setFile(null);
  
        if (club?.id) bringPosts(club.id);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col md:flex-row text-zinc-100 selection:bg-indigo-500/30 overflow-x-hidden">
      
      <SideBar
        activeTab="news"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />
  
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Ambient */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/5 blur-[100px] md:blur-[140px] -z-10 pointer-events-none" />
  
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#020202]/50 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black border border-white/10">
              {club?.name?.substring(0, 2).toUpperCase() || "NX"}
            </div>
  
            <h1 className="text-xs font-black text-white uppercase tracking-widest italic truncate">
              {club?.name || "Ачаалж байна..."}
            </h1>
          </div>
  
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Radio size={10} className="text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
              Шууд
            </span>
          </div>
        </header>
  
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-10 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
  
            {/* LEFT */}
            <div className="lg:col-span-8 space-y-10">
  
              {/* CREATE POST */}
              <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
  
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <Zap size={16} className="text-indigo-500" />
                    <input
                      value={caption}
                      placeholder="Дамжуулалтын гарчиг..."
                      className="bg-transparent text-xl font-black text-white outline-none w-full"
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
  
                  <textarea
                    value={details}
                    placeholder="Клубын гишүүдэд мэдээлэл илгээх..."
                    rows={3}
                    className="w-full bg-transparent text-zinc-400 text-sm resize-none outline-none"
                    onChange={(e) => setDetails(e.target.value)}
                  />
  
                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative rounded-2xl overflow-hidden border border-white/10"
                      >
                        <img src={imagePreview} className="w-full h-64 object-cover" />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="absolute top-3 right-3 p-2 bg-black/60 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
  
                  <div className="flex justify-between items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
  
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-zinc-500 hover:text-white"
                    >
                      <ImageIcon size={14} /> Файл хавсаргах
                    </button>
  
                    <button
                      onClick={createPost}
                      disabled={!caption || !details || isSubmitting}
                      className="px-8 py-3 bg-white text-black text-xs font-black rounded-xl disabled:opacity-30"
                    >
                      {isSubmitting ? "Илгээж байна..." : "Дамжуулах"}
                    </button>
                  </div>
  
                </div>
              </section>
  
              {/* POSTS */}
              <div className="grid gap-8">
                {posts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                  >
                    <h3 className="text-2xl font-black text-white mb-3">
                      {post.title}
                    </h3>
  
                    <p className="text-zinc-400 mb-6">
                      {post.content}
                    </p>
  
                    {post.image?.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border border-white/5">
                        <img
                          src={post.image[0]}
                          onClick={() => setSelectedImage(post.image[0])}
                          className="w-full max-h-[520px] object-cover cursor-zoom-in hover:opacity-80 transition"
                        />
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
  
            </div>
  
            {/* RIGHT */}
            <aside className="lg:col-span-4">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                <p className="text-6xl font-black text-white">
                  {club?.clubToStudents?.length || 0}
                </p>
                <p className="text-indigo-500 text-xs font-black mt-2">
                  Идэвхтэй гишүүд
                </p>
              </div>
            </aside>
  
          </div>
        </div>
  
        {/* ⭐ FULLSCREEN VIEWER */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                src={selectedImage}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="max-h-[92vh] max-w-[92vw] object-contain rounded-3xl shadow-2xl"
              />
  
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute top-8 right-8 bg-white/10 hover:bg-red-500 text-white p-3 rounded-full"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
  
      </main>
  
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
  
    </div>
  );
};

export default Page;