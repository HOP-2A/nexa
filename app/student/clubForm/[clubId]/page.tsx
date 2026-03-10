"use client";

import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Key, FileText, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SideBar from "@/app/_component/sideBar";

const Page = () => {
  const params = useParams();
  const clubId = params.clubId as string;
  const { isLoaded, user } = useUser();
  const { push } = useRouter();

  const [club, setClub] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [code, setCode] = useState("");
  const [inputs, setInputs] = useState({
    age: "",
    class: "",
    personalStatement: "",
    experience: "",
    skills: "",
    why: "",
  });

  // 1. Fetch Club Information
  useEffect(() => {
    if (!isLoaded || !user || !clubId) return;

    const fetchClubData = async () => {
      try {
        const res = await fetch(`/api/club-management/bring-club-info/${clubId}`);
        if (res.ok) {
          const data = await res.json();
          setClub(data);
        }
      } catch (error) {
        console.error("Failed to fetch club data", error);
      }
    };
    fetchClubData();
  }, [isLoaded, user, clubId]);

  // 2. Fetch Application Status (FIXED Logic)
  useEffect(() => {
    // Only run this when both user and club data are available
    if (!user?.id || !club?.id) return;

    const checkExistingApplication = async () => {
      try {
        const res = await fetch("/api/student/FindInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            studentClerk: user.id, 
            clubId: club.id 
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        }
      } catch (error) {
        console.error("Failed to check application status", error);
      }
    };

    checkExistingApplication();
  }, [user?.id, club?.id]); // Only re-run if user ID or club ID changes

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const JoinByCode = async () => {
    if (code === club?.code) {
      const res = await fetch("/api/club-management/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentClerk: user?.id, clubId }),
      });
      if (res.ok) {
        toast.success("Joined successfully!");
        push(`/student/Clubs/${clubId}`);
      }
    } else {
      toast.error("Invalid club code");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202] text-zinc-300 overflow-hidden">
      
      {/* SIDEBAR */}
      <SideBar
        activeTab="news"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10" />

        <div className="p-8 md:p-16 max-w-5xl mx-auto w-full space-y-12">
          
          {/* Top Navigation */}
          <button 
            onClick={() => push("/student/myClubs")}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Clubs
          </button>

          {/* Club Header */}
          <header className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
              {club?.name || "Loading..."}<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
              {club?.description || "Description is being retrieved..."}
            </p>
          </header>

          {/* Stats Bar (Deleted Status Block as requested) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Current Members</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">
                  {club?.clubToStudents?.length || 0}
                </p>
              </div>
              <Users size={32} className="text-zinc-800" />
            </div>
          </div>

          {/* Actions Section */}
          {!form ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Option 1: Code */}
              <section className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-3">
                  <Key className="text-indigo-500" size={18} />
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Join with Code</h3>
                </div>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Code"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-indigo-500 transition-all font-mono tracking-widest"
                />
                <button 
                  onClick={JoinByCode}
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]"
                >
                  Join Club
                </button>
              </section>

              {/* Option 2: Apply */}
              <section className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-indigo-500" size={18} />
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">No Code?</h3>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">Submit an application to the club leader for review.</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center justify-between w-full bg-white/5 p-5 rounded-xl border border-white/10 hover:border-indigo-500 transition-all group mt-8">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Open Application</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-zinc-600" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white rounded-[2.5rem] p-10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Application</DialogTitle>
                      <DialogDescription className="text-zinc-600 uppercase text-[10px] font-bold tracking-widest">Apply to join {club?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 mt-6">
                      <input name="class" onChange={handleInput} placeholder="Class (e.g. 12B)" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" />
                      <textarea name="why" onChange={handleInput} placeholder="Tell us why you want to join..." className="bg-white/5 border border-white/10 p-4 rounded-xl h-32 outline-none focus:border-indigo-500 resize-none" />
                      <button onClick={() => toast.success("Submitted!")} className="bg-indigo-600 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-500/20">Submit Application</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </section>

            </div>
          ) : (
            /* Application Status */
            <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[2.5rem] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="text-indigo-500" size={20} />
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Request Logged</h2>
                </div>
                <p className="text-zinc-500 text-sm">You have already applied. We will notify you once reviewed.</p>
              </div>
              <div className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{form.status}</span>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-6 pt-10">
            <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] border-l-2 border-indigo-500 pl-4">
              Current Members
            </h3>
            <div className="flex flex-wrap gap-4">
              {club?.clubToStudents?.map((el: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-default">
                  <Avatar className="h-5 w-5 border border-white/10">
                    <AvatarImage src={el?.Student?.profilePic} />
                    <AvatarFallback className="text-[8px]">{el?.Student?.firstname?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    {el?.Student?.firstname} {el?.Student?.clerkId === user?.id && <span className="text-indigo-500">(YOU)</span>}
                  </span>
                </div>
              ))}
            </div>
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