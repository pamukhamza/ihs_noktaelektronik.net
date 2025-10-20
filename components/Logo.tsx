import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
    
    
    <Link href="/" className=''>
        <Image alt='login'
        src="/logo_new.png"
        width={205}
        height={50}
        className='h-full w-full object-cover object-top'/>
    </Link>
  )
}

export default Logo