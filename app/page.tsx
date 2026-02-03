"use client"
import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 sm:px-4 py-4">
        <div className="text-2xl font-bold text-blue-600">NEXA</div>
        <div className="flex gap-3">
         <SignInButton/>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition" onClick={()=>{router.push("/signup")}}>
            Sign up
          </button>
        </div>
      </nav>
      <section className="relative max-w-7xl mx-auto px-6 sm:px-4 rounded mb-3 py-20 text-center bg-white shadow-sm overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-20 -z-10"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-300 rounded-full opacity-10 -z-10"></div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Connect. Learn. Lead. <span className="text-blue-600">Together.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          EduLink connects school clubs, mentors, and students into one powerful community. 
          Learn from seniors, lead clubs, join events, and grow together.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white text-lg hover:bg-blue-700 transition">
            Get Started
          </button>
       
            <SignInButton />

        </div>
      </section>
      <section className="relative max-w-7xl mx-auto px-6 sm:px-4 py-16 rounded mb-3 bg-blue-50 overflow-hidden">
        <div className="absolute top-10 left-0 w-36 h-36 bg-blue-100 rounded-full opacity-20 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-10 -z-10"></div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { title: "Clubs", desc: "Join school clubs, apply easily, and stay updated with events." },
            { title: "Mentorship", desc: "Connect juniors with seniors for subject-based guidance." },
            { title: "Community", desc: "Post, chat, vote, and collaborate inside club communities." },
            { title: "Events & Calendar", desc: "See all your club events in one organized calendar." }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative max-w-7xl mx-auto px-6 sm:px-4 py-20 bg-white rounded mb-3 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-10 -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-200 rounded-full opacity-10 -z-10"></div>

        <h2 className="text-3xl font-bold text-center mb-12">
          Built for everyone in your school
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { role: "Students", text: "Join clubs, find mentors, attend events, and grow your skills." },
            { role: "Club Leaders", text: "Manage members, approve requests, post updates, and organize events." },
            { role: "Mentors", text: "Share knowledge, connect with students, and build your reputation." }
          ].map((item, index) => (
            <div key={index} className="bg-blue-50 rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{item.role}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="relative py-6 text-center text-gray-500 text-sm bg-gray-50 border-t border-gray-200 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-10 -z-10"></div>
        © 2026 EduLink. Built for students, by students.
      </footer>

    </div>
  );
};

export default Page;
