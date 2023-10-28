import React from 'react'
import RythmLogo from "../assets/rythm-logo.png"
import LoginBtn from './LoginBtn'
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import LogoutBtn from './LogoutBtn';

const Navbar = () => {
  return (
    <nav className="flex py-2 px-12 justify-center items-center shadow-md">
      <div className="mr-auto">
        <img src={RythmLogo} className=' w-36' />
      </div>
      <Unauthenticated>
        <LoginBtn />
      </Unauthenticated>
      <Authenticated>
        <LogoutBtn />
      </Authenticated>

    </nav>
  )
}

export default Navbar