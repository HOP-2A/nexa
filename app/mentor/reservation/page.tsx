"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Check,
  X,
  Inbox,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Wifi,
  AlertTriangle,
  Calendar,
  Users,
  Menu
} from "lucide-react";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "BOOKED" | string;

type Student = {
  firstname: string;
  lastname: string;
  email: string;
};

type Reservation = {
  id: string;
  availableDate: string | Date;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  student?: Student | null;
};

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();

  const [reservations, setReservation] = useState<Reservation[]>([]);
  const [bookedReservations, setBookedReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [processing, setProcessing] = useState<{ id: string; type: "confirm" | "reject" } | null>(null);
  const [pendingAction, setPendingAction] = useState<{ res: Reservation; type: "confirm" | "reject" } | null>(null);

  const { user } = useAuth(clerkUser?.id) as { user: { id: string } | null };
  const mentorId = useMemo(() => user?.id ?? null, [user]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchData = useCallback(async () => {
    if (!mentorId) return;
    setLoading(true);
    try {
      const [resAll, resBooked] = await Promise.all([
        fetch("/api/mentorAvailability/mentorAllReservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentorId }),
        }),
        fetch("/api/mentorAvailability/studentAlreadyBooked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentorId }),
        }),
      ]);

      if (resAll.ok) {
        const data = await resAll.json();
        setReservation(Array.isArray(data) ? data.filter((r: Reservation) => r.status === "PENDING") : []);
      }
      if (resBooked.ok) {
        const data = await resBooked.json();
        setBookedReservations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Uplink Error:", error);
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async () => {
    if (!pendingAction) return;
    const { res, type } = pendingAction;
    setProcessing({ id: res.id, type });
    setPendingAction(null); 
    
    const endpoint = type === "confirm" 
      ? "/api/mentorAvailability/mentorReservationConfirmation" 
      : "/api/mentorAvailability/mentorReservationRejection";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: res.id, status: type === "confirm" ? "BOOKED" : "CANCELED" }),
      });
      if (!response.ok) throw new Error("Terminal Protocol Failure");
      await fetchData();
    } catch (error) {
      alert("Submission Failed: System Offline");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050505] text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <MentorSideBar
        activeTab="reservation"
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/account")} 
        editProfile={() => {}}      
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER - RESPONSIVE PADDING */}
        <header className="px-6 lg:px-12 py-6 lg:py-10 border-b border-white/[0.03] flex flex-col sm:flex-row justify-between items-start sm:items-end bg-black/20 backdrop-blur-3xl shadow-2xl gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[9px] lg:text-[10px] tracking-[0.4em] lg:tracking-[0.5em] uppercase mb-1 lg:mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Neural Link Active
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white uppercase italic">
              Schedule <span className="text-indigo-500">Control</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[9px] lg:text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
            {loading ? <Loader2 size={10} className="animate-spin" /> : <Wifi size={10} />}
            {loading ? "Syncing..." : "256-Bit Secure"}
          </div>
        </header>

        {/* CONTENT AREA - STACKS ON MOBILE */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden overflow-y-auto lg:overflow-hidden no-scrollbar">
          
          {/* LEFT: INCOMING NODES */}
          <section className="w-full lg:flex-[1.6] p-6 lg:p-12 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/[0.03] no-scrollbar custom-gradient-bg">
            <div className="flex items-center justify-between mb-8 lg:mb-12">
              <div className="flex items-center gap-3 lg:gap-5">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white text-black rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Inbox size={20} />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight">Incoming Nodes</h2>
                  <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pending: {reservations.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <AnimatePresence mode="popLayout">
                {reservations.map((res) => (
                  <motion.div
                    key={res.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative bg-zinc-900/30 border border-white/[0.05] p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] hover:border-indigo-500/40 transition-all backdrop-blur-md"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 lg:mb-10 gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg lg:text-xl font-bold text-white uppercase tracking-tight">{res.student?.firstname} {res.student?.lastname}</h3>
                          <p className="text-[10px] text-zinc-500 lowercase truncate max-w-[200px]">{res.student?.email}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs lg:text-sm font-black text-white italic">{formatDate(res.availableDate)}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-indigo-400">{res.startTime} - {res.endTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 lg:gap-3 mt-auto">
                        <button
                          disabled={!!processing}
                          onClick={() => setPendingAction({ res, type: "confirm" })}
                          className="flex-[2] bg-white text-black h-10 lg:h-12 rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-[10px] uppercase tracking-[0.1em] lg:tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                        >
                           Accept Session
                        </button>
                        <button
                          disabled={!!processing}
                          onClick={() => setPendingAction({ res, type: "reject" })}
                          className="flex-1 bg-zinc-950 border border-white/10 text-zinc-500 h-10 lg:h-12 rounded-xl lg:rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center active:scale-95"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* RIGHT: BOOKED STUDENTS */}
          <aside className="w-full lg:flex-1 p-6 lg:p-12 bg-[#080808]/80 lg:overflow-y-auto no-scrollbar backdrop-blur-xl">
            <div className="flex items-center gap-3 lg:gap-5 mb-8 lg:mb-12">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center text-emerald-400">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight">Booked Students</h2>
                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{bookedReservations.length} Verified Entries</p>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {bookedReservations.map((res) => (
                <Dialog key={res.id}>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ x: 6 }}
                      className="group cursor-pointer flex justify-between items-center p-4 lg:p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl lg:rounded-3xl hover:bg-indigo-500/10 transition-all"
                    >
                      <div className="flex items-center gap-4 lg:gap-5">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-[9px] lg:text-[10px] font-black text-indigo-400 uppercase">
                          {res.student?.firstname?.[0]}{res.student?.lastname?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-bold text-[11px] lg:text-xs uppercase tracking-[0.1em]">{res.student?.firstname} {res.student?.lastname}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 mt-0.5 italic uppercase tracking-tighter truncate max-w-[120px] lg:max-w-none">
                            {res.startTime} — {formatDate(res.availableDate)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-all" />
                    </motion.div>
                  </DialogTrigger>

                  <DialogContent className="w-[95vw] max-w-lg bg-[#0a0a0a] border border-white/5 text-white rounded-[2rem] lg:rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Details for {res.student?.firstname || 'Student'}</DialogTitle>
                    </DialogHeader>
                    <div className="bg-emerald-600 p-6 lg:p-10 relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter italic">Session Verified</h2>
                        <div className="inline-block mt-2 px-3 py-1 bg-black/20 rounded-full text-[8px] lg:text-[9px] font-black uppercase">Protocol: {res.id.slice(0, 8)}</div>
                      </div>
                      <ShieldCheck size={100} className="absolute -right-8 -bottom-8 text-white opacity-10" />
                    </div>
                    <div className="p-6 lg:p-12 space-y-6 lg:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                        <div className="space-y-1 lg:space-y-2">
                          <p className="text-[9px] lg:text-[10px] font-black text-zinc-600 uppercase tracking-widest">Student Node</p>
                          <p className="font-bold text-lg lg:text-xl text-white tracking-tight">{res.student?.firstname} {res.student?.lastname}</p>
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                          <p className="text-[9px] lg:text-[10px] font-black text-zinc-600 uppercase tracking-widest">Uplink Time</p>
                          <p className="font-bold text-lg lg:text-xl text-white tracking-tight">{res.startTime} - {res.endTime}</p>
                        </div>
                      </div>
                      <div className="pt-6 lg:pt-8 border-t border-white/[0.05]">
                        <p className="text-[9px] lg:text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 lg:mb-2">Comms Channel</p>
                        <p className="font-bold text-indigo-400 select-all tracking-tight lowercase text-sm lg:text-base break-all">{res.student?.email}</p>
                      </div>
                    </div>
                    <div className="px-6 lg:px-12 pb-6 lg:pb-12">
                      <DialogClose asChild>
                        <button className="w-full bg-zinc-900 border border-white/10 text-zinc-400 h-14 lg:h-16 rounded-xl lg:rounded-[1.5rem] font-black uppercase text-[9px] lg:text-[10px] tracking-[0.3em] lg:tracking-[0.4em] hover:bg-white hover:text-black transition-all">Close Terminal</button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {/* CONFIRMATION DIALOG - RESPONSIVE MAX-WIDTH */}
      <Dialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent className="w-[90vw] max-w-md bg-[#0a0a0a] border border-white/10 text-white rounded-[2rem] p-6 lg:p-10 shadow-2xl overflow-hidden">
          <DialogHeader className="space-y-4 lg:space-y-6">
            <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center ${pendingAction?.type === 'confirm' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {pendingAction?.type === 'confirm' ? <Check size={28} /> : <AlertTriangle size={28} />}
            </div>
            <div>
              <DialogTitle className="text-2xl lg:text-3xl font-black uppercase tracking-tighter italic">Confirm Submit</DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium mt-2 leading-relaxed text-xs lg:text-sm">
                Decision: <span className={pendingAction?.type === 'confirm' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{pendingAction?.type === 'confirm' ? 'ACCEPT' : 'REJECT'}</span> session request for <span className="text-white font-bold">{pendingAction?.res?.student?.firstname || 'Student'}</span>.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 lg:gap-4">
             <button onClick={handleAction} disabled={!!processing} className="flex-[2] h-14 lg:h-16 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] bg-white text-black hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center">
              {processing ? <Loader2 className="animate-spin" size={18} /> : "Submit Decision"}
            </button>
            <DialogClose asChild>
              <button className="flex-1 h-14 lg:h-16 bg-zinc-900 border border-white/5 text-zinc-500 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all">Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-gradient-bg {
          background-image: radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.05), transparent 50%),
                            radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.02), transparent 50%);
        }
      `}</style>
    </div>
  );
};

export default Page;