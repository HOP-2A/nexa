"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "STUDENT",
    password: "",
    socialPlatform:"",
    profileLink:""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  

  const Signup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (res.ok) {
      router.push("https://patient-alien-39.accounts.dev/sign-in");
    }
  };
  console.log(inputs)
 
  const isMentorMissingPlatform =
  inputs.role === "MENTOR" && !inputs.socialPlatform?.trim();

const isMentorMissingLink =
  inputs.role === "MENTOR" &&
  inputs.socialPlatform &&
  !inputs.profileLink?.trim();

const isMentorInvalid =
  inputs.role === "MENTOR" &&
  (!inputs.socialPlatform?.trim() || !inputs.profileLink?.trim());``
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans text-slate-900">
      
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 py-12">
        <div className="max-w-md w-full mx-auto space-y-10">
  
          {/* Branding */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">
              StudentPlatform
            </span>
          </div>
  
          {/* Header */}
          <header className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">
              Create your account
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Please provide your details to get started.
            </p>
          </header>
  
          <div className="space-y-6">
  
            {/* Role Switcher */}
            <div className="p-1 bg-slate-100 rounded-2xl flex border border-slate-200">
              <button
                onClick={() =>
                  handleValue({ target: { name: "role", value: "STUDENT" } })
                }
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  inputs.role === "STUDENT"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Student
              </button>
              <button
                onClick={() =>
                  handleValue({ target: { name: "role", value: "MENTOR" } })
                }
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  inputs.role === "MENTOR"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Mentor
              </button>
            </div>
  
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  First Name
                </label>
                <input
                  name="firstname"
                  onChange={handleValue}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Last Name
                </label>
                <input
                  name="lastname"
                  onChange={handleValue}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>
  
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                onChange={handleValue}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
  
            {/* Mentor Section */}
            {inputs.role === "MENTOR" && (
              <div className="space-y-5">
  
                {/* Social Platform */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Social Platform
                  </label>
  
                  <select
                    name="socialPlatform"
                    value={inputs.socialPlatform || ""}
                    onChange={handleValue}
                    className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all ${
                      isMentorMissingPlatform
                        ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                        : "border-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                    }`}
                  >
                    <option value="">Select platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
  
                  {isMentorMissingPlatform && (
                    <p className="text-xs text-red-500 font-medium">
                      Please select a social platform.
                    </p>
                  )}
                </div>
  
                {/* Info Box */}
                {inputs.socialPlatform && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-800">
                    <span className="font-semibold">Important:</span> Students will
                    contact you via your selected{" "}
                    <span className="capitalize font-semibold">
                      {inputs.socialPlatform}
                    </span>{" "}
                    account.
                  </div>
                )}
  
                {/* Profile Link */}
                {inputs.socialPlatform && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Profile Link
                    </label>
  
                    <input
                      name="profileLink"
                      value={inputs.profileLink || ""}
                      onChange={handleValue}
                      className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all ${
                        isMentorMissingLink
                          ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                          : "border-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                      }`}
                    />
  
                    {isMentorMissingLink && (
                      <p className="text-xs text-red-500 font-medium">
                        Please enter your profile link.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
  
            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleValue}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
  
            {/* Submit Button */}
            <button
              onClick={Signup}
              disabled={isMentorInvalid}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]
                transition-all duration-300 shadow-2xl active:scale-[0.98]
                ${
                  isMentorInvalid
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-slate-900 hover:bg-indigo-600 text-white shadow-indigo-100"
                }`}
            >
              Create Account
            </button>
  
          </div>
        </div>
      </div>
  
      {/* RIGHT SIDE */}
      <div className="hidden lg:flex bg-slate-50 items-center justify-center p-12">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-black tracking-tighter">
            The standard for <br />
            <span className="text-indigo-600">
              Educational Networking.
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
