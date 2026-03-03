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
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[420px] space-y-5">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        <input
          name="firstname"
          placeholder="First Name"
          onChange={handleValue}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          name="lastname"
          placeholder="Last Name"
          onChange={handleValue}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleValue}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleValue}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-600">I am a</label>
          <select
            name="role"
            onChange={handleValue}
            value={inputs.role}
            className="w-full mt-1 p-3 rounded-xl border bg-indigo-50 text-indigo-700 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="STUDENT">🎓 Student</option>
            <option value="MENTOR">👩‍🏫 Mentor</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Signing up as:{" "}
          <span className="font-semibold text-indigo-600">{inputs.role}</span>
        </div>

        <button
          onClick={Signup}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-semibold transition duration-200 shadow-md"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
