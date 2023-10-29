import { useState } from 'react'
import './App.css'
import LoginBtn from './components/LoginBtn'

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Navbar from './components/Navbar';
import Transcript from './components/Transcript';

function App() {
  return (
    <div className="bg-[#022A3B] w-[100vw] h-[100vh]">
      <Navbar />

      <Transcript />
    </div>
  );
}
export default App

