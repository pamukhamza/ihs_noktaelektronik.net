/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Footer from './_components/footer'
import Navbar from './_components/Menu/Navbar'
import TopBar from './_components/Menu/TopBar'

interface RoutesLayoutProps{
    children:React.ReactNode
}

const RoutesLayout = ({children}:RoutesLayoutProps) => {
  return (
    <>
        <TopBar />
        <Navbar/>
        <div className='min-h-screen'>
            {children}
        </div>  
        <Footer/>
    </>
  )
}

export default RoutesLayout