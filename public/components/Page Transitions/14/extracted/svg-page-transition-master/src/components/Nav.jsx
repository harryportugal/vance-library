import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <nav className='fixed top-6 left-1/2 -translate-x-1/2 z-50'>
        <div className='flex items-center gap-8 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg px-6 py-3 shadow-sm'>
          <Link href="/" className='text-sm font-semibold tracking-tight'>Home</Link>
          <div className='w-px h-4 bg-gray-300'></div>
          <Link href="/about" className='text-sm font-semibold tracking-tight'>About</Link>
        </div>
    </nav>
  )
}

export default Nav