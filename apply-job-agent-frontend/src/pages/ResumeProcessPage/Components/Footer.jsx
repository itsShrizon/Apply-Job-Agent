import React from 'react'

function Footer() {
  return (
    <>
        <div className="mt-16 text-center relative">
            <div className="inline-block px-8 py-3 rounded-full bg-[#F7F3E9] border border-[#F7F3E9] shadow-sm">
            <p className="text-sm text-[#3E3E3E]">© {new Date().getFullYear()} <span className="font-semibold">GiveJob</span> Resume Scanner. All rights reserved.</p>
            </div>
            <p className="mt-3 text-xs text-[#3E3E3E]/60">Powered by advanced AI to find your perfect job match</p>
        </div>
    </>
  )
}

export default Footer