"use client"

import { useState } from "react"
import { Home, Users, Newspaper, User, Menu, X } from "lucide-react"

type PropsType = {
  home: () => void
  members: () => void
  news: () => void
  account: () => void
}

const SideBar = ({ home, members, news, account }: PropsType) => {
  const [open, setOpen] = useState(false)

  const baseBtn =
    "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium"

  const idle =
    "text-gray-600 hover:bg-gray-100 hover:text-black"

  const NavButtons = () => (
    <>
      <button onClick={() => { home(); setOpen(false) }} className={`${baseBtn} ${idle}`}>
        <Home size={18} />
        Home
      </button>

      <button onClick={() => { members(); setOpen(false) }} className={`${baseBtn} ${idle}`}>
        <Users size={18} />
       Mentors
      </button>

      <button onClick={() => { news(); setOpen(false) }} className={`${baseBtn} ${idle}`}>
        <Newspaper size={18} />
        News
      </button>

      <button onClick={() => { account(); setOpen(false) }} className={`${baseBtn} ${idle}`}>
        <User size={18} />
       Account
      </button>
    </>
  )

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
        <h1 className="font-bold text-lg">Dashboard</h1>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* ===== Overlay (mobile) ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-white border-r p-4 flex flex-col justify-between z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Dashboard</h1>

            {/* Close button (mobile only) */}
            <button className="md:hidden" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <nav className="space-y-2">
            <NavButtons />
          </nav>
        </div>

        {/* Bottom */}
        <div className="text-xs text-gray-400 px-2">
          © 2026 Your App
        </div>
      </aside>
    </>
  )
}

export default SideBar
