"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShieldCheck, Globe, Sparkles, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "STUDENT",
    password: "",
    socialPlatform: "",
    profileLink: "",
    experienceYears: "",
    bio: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const setRole = (role: string) => setInputs((prev) => ({ ...prev, role }));

  
  const onSignup = async () => {
    setIsLoading(true);
    // Simulate API call delay for UX
    setTimeout(() => {
        setIsLoading(false);
        // router.push("/success"); 
    }, 1500);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (res.ok) {
      router.push("https://patient-alien-39.accounts.dev/sign-in");
    }
  };

  const isMentorInvalid = inputs.role === "MENTOR" && (!inputs.socialPlatform || !inputs.profileLink);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 flex items-stretch overflow-hidden">
      
      {/* LEFT SIDE: The Form Section */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 z-10 bg-[#050505] border-r border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-[440px] w-full mx-auto"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="font-black text-lg">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white/90">StudentPlatform</span>
          </div>

          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
            <p className="text-slate-500 text-sm">Enter your details to join our professional network.</p>
          </div>

          {/* Precision Role Switcher */}
          <div className="flex p-1 bg-white/[0.03] border border-white/10 rounded-xl mb-8 relative">
            {["STUDENT", "MENTOR"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] z-10 transition-colors duration-300 ${
                  inputs.role === r ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {r}
              </button>
            ))}
            <motion.div
              className="absolute top-1 bottom-1 left-1 bg-white/[0.07] border border-white/10 rounded-lg shadow-xl"
              initial={false}
              animate={{
                x: inputs.role === "STUDENT" ? "0%" : "100%",
                width: "49%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          </div>

          <div className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name" name="firstname" onChange={handleValue} placeholder="Jane" icon={<User size={14}/>} />
              <InputGroup label="Last Name" name="lastname" onChange={handleValue} placeholder="Doe" />
            </div>

            {/* Email */}
            <InputGroup label="Email Address" name="email" type="email" onChange={handleValue} placeholder="name@company.com" icon={<Mail size={14}/>} />

            {/* Conditional Mentor Fields */}
            <AnimatePresence>
              {inputs.role === "MENTOR" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 pt-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase ml-1">Platform</label>
                      <select name="socialPlatform" onChange={handleValue} className="custom-select">
                        <option value="">Select...</option>
                        <option value="linkedin">Facebook</option>
                        <option value="twitter">X / Twitter</option>
                        <option value="github">Instagram</option>
                      </select>
                    </div>
                    <InputGroup label="Experience" name="experienceYears" onChange={handleValue} placeholder="e.g. 4 years" />
                  </div>
                  <InputGroup label="Profile URL" name="profileLink" onChange={handleValue} placeholder="https://linkedin.com/in/..." />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div className="relative">
              <InputGroup 
                label="Password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                onChange={handleValue} 
                placeholder="••••••••" 
                icon={<Lock size={14}/>} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[34px] text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              onClick={onSignup}
              disabled={isMentorInvalid || isLoading}
              className="w-full mt-4 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account? <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Visual Brand Section */}
      <div className="hidden lg:flex flex-1 bg-[#0a0a0a] relative items-center justify-center p-12">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 w-full max-w-lg">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} /> New Mentorship Program 2024
            </div>
            
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Bridge the gap between <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Learning and Career.</span>
            </h2>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <StatCard title="12k+" subtitle="Active Students" />
              <StatCard title="850+" subtitle="Verified Mentors" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-input {
          @apply w-full h-12 px-4 bg-white/[0.03] border border-white/10 rounded-xl outline-none transition-all 
                 text-sm placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05]
                 focus:ring-4 focus:ring-indigo-500/10;
        }
        .custom-select {
          @apply w-full h-12 px-4 bg-white/[0.03] border border-white/10 rounded-xl outline-none transition-all 
                 text-sm text-slate-400 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10;
        }
      `}</style>
    </div>
  );
}

// Sub-component for clean Input Groups
function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-slate-500 uppercase ml-1 tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">{icon}</div>}
        <input className={`custom-input ${icon ? 'pl-10' : ''}`} {...props} />
      </div>
    </div>
  );
}

function StatCard({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
      <div className="text-2xl font-bold text-white mb-1">{title}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{subtitle}</div>
    </div>
  );
} 