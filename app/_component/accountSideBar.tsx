"use client"

import { User, Users, Settings, CreditCard } from "lucide-react"

type PropsType = {
  personalInformation: () => void
  myclubs: () => void
  settings: () => void
  paymentHistory: () => void
}

const AccountSideBar = ({
  personalInformation,
  myclubs,
  settings,
  paymentHistory,
}: PropsType) => {
  const btn =
    "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-black"

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 bg-slate-50 border-r border-slate-200 p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Account
      </h2>

      <div className="space-y-1">
        <button onClick={personalInformation} className={btn}>
          <User size={16} />
          Personal Info
        </button>

        <button onClick={myclubs} className={btn}>
          <Users size={16} />
          My Clubs
        </button>

      
      </div>
    </aside>
  )
}

export default AccountSideBar
